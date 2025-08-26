package com.scheduleplanner.backend.controller;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.service.TimeBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timeblocks")
@CrossOrigin(origins = "http://localhost:3000")
public class TimeBlockController {
    
    @Autowired
    private TimeBlockService timeBlockService;
    
    @GetMapping
    public ResponseEntity<List<TimeBlock>> getAllTimeBlocks() {
        List<TimeBlock> timeBlocks = timeBlockService.getAllTimeBlocks();
        return ResponseEntity.ok(timeBlocks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TimeBlock> getTimeBlockById(@PathVariable Long id) {
        return timeBlockService.getTimeBlockById(id)
                .map(timeBlock -> ResponseEntity.ok().body(timeBlock))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/day/{day}")
    public ResponseEntity<List<TimeBlock>> getTimeBlocksByDay(@PathVariable String day) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByDay(day);
        return ResponseEntity.ok(timeBlocks);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TimeBlock>> getTimeBlocksByType(@PathVariable String type) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByType(type);
        return ResponseEntity.ok(timeBlocks);
    }
    
    @PostMapping
    public ResponseEntity<TimeBlock> createTimeBlock(@Valid @RequestBody TimeBlock timeBlock) {
        try {
            // Check for overlapping time blocks
            List<TimeBlock> overlapping = timeBlockService.checkForOverlaps(
                timeBlock.getDay(), timeBlock.getStartTime(), timeBlock.getEndTime());
            
            if (!overlapping.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            TimeBlock createdTimeBlock = timeBlockService.createTimeBlock(timeBlock);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTimeBlock);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TimeBlock> updateTimeBlock(@PathVariable Long id, 
                                                   @Valid @RequestBody TimeBlock timeBlockDetails) {
        try {
            // Check for overlapping time blocks (excluding the current one)
            List<TimeBlock> overlapping = timeBlockService.checkForOverlaps(
                timeBlockDetails.getDay(), timeBlockDetails.getStartTime(), timeBlockDetails.getEndTime());
            overlapping.removeIf(tb -> tb.getId().equals(id));
            
            if (!overlapping.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            TimeBlock updatedTimeBlock = timeBlockService.updateTimeBlock(id, timeBlockDetails);
            return ResponseEntity.ok(updatedTimeBlock);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTimeBlock(@PathVariable Long id) {
        try {
            timeBlockService.deleteTimeBlock(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/check-overlap")
    public ResponseEntity<List<TimeBlock>> checkOverlap(@RequestParam String day,
                                                       @RequestParam String startTime,
                                                       @RequestParam String endTime) {
        List<TimeBlock> overlapping = timeBlockService.checkForOverlaps(day, startTime, endTime);
        return ResponseEntity.ok(overlapping);
    }
    
    @GetMapping("/type-colors")
    public ResponseEntity<Map<String, String>> getTypeColors() {
        Map<String, String> typeColors = timeBlockService.getTypeColors();
        return ResponseEntity.ok(typeColors);
    }
}
