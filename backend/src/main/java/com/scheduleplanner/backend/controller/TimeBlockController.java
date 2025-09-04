package com.scheduleplanner.backend.controller;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.model.TimeBlock.DayOfWeek;
import com.scheduleplanner.backend.model.TimeBlockDTO;
import com.scheduleplanner.backend.service.TimeBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/timeblocks")
@CrossOrigin(origins = "http://localhost:3000")
public class TimeBlockController {
    
    @Autowired
    private TimeBlockService timeBlockService;
    
    @GetMapping
    public ResponseEntity<List<TimeBlockDTO>> getAllTimeBlocks() {
        List<TimeBlock> timeBlocks = timeBlockService.getAllTimeBlocks();
        List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                .map(TimeBlockDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(timeBlockDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TimeBlockDTO> getTimeBlockById(@PathVariable Long id) {
        return timeBlockService.getTimeBlockById(id)
                .map(timeBlock -> ResponseEntity.ok().body(new TimeBlockDTO(timeBlock)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksByStudentId(@PathVariable Long studentId) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByStudentId(studentId);
        List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                .map(TimeBlockDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(timeBlockDTOs);
    }
    
    @GetMapping("/student/{studentId}/schedule")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksForScheduleView(@PathVariable Long studentId) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksForScheduleView(studentId);
        List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                .map(TimeBlockDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(timeBlockDTOs);
    }
    
    @GetMapping("/student/{studentId}/day/{day}")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksByStudentIdAndDay(
            @PathVariable Long studentId, @PathVariable String day) {
        try {
            DayOfWeek dayOfWeek = DayOfWeek.valueOf(day);
            List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByStudentIdAndDay(studentId, dayOfWeek);
            List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                    .map(TimeBlockDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(timeBlockDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/day/{day}")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksByDay(@PathVariable String day) {
        try {
            DayOfWeek dayOfWeek = DayOfWeek.valueOf(day);
            List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByDay(dayOfWeek);
            List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                    .map(TimeBlockDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(timeBlockDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksByType(@PathVariable String type) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByType(type);
        List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                .map(TimeBlockDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(timeBlockDTOs);
    }
    
    @GetMapping("/student/{studentId}/type/{type}")
    public ResponseEntity<List<TimeBlockDTO>> getTimeBlocksByStudentIdAndType(
            @PathVariable Long studentId, @PathVariable String type) {
        List<TimeBlock> timeBlocks = timeBlockService.getTimeBlocksByStudentIdAndType(studentId, type);
        List<TimeBlockDTO> timeBlockDTOs = timeBlocks.stream()
                .map(TimeBlockDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(timeBlockDTOs);
    }
    
    @PostMapping
    public ResponseEntity<TimeBlockDTO> createTimeBlock(@Valid @RequestBody TimeBlockDTO timeBlockDTO) {
        try {
            TimeBlock timeBlock = timeBlockDTO.toEntity();
            
            // Check for overlapping time blocks for the specific student
            if (timeBlock.getStudentId() != null) {
                List<TimeBlock> overlapping = timeBlockService.checkForOverlapsForStudent(
                    timeBlock.getStudentId(), timeBlock.getDay(), timeBlock.getStartTime(), timeBlock.getEndTime());
                
                if (!overlapping.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).build();
                }
            }
            
            TimeBlock createdTimeBlock = timeBlockService.createTimeBlock(timeBlock);
            return ResponseEntity.status(HttpStatus.CREATED).body(new TimeBlockDTO(createdTimeBlock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TimeBlockDTO> updateTimeBlock(@PathVariable Long id, 
                                                       @Valid @RequestBody TimeBlockDTO timeBlockDTO) {
        try {
            TimeBlock timeBlockDetails = timeBlockDTO.toEntity();
            
            // Check for overlapping time blocks for the specific student (excluding the current one)
            if (timeBlockDetails.getStudentId() != null) {
                List<TimeBlock> overlapping = timeBlockService.checkForOverlapsForStudent(
                    timeBlockDetails.getStudentId(), timeBlockDetails.getDay(), 
                    timeBlockDetails.getStartTime(), timeBlockDetails.getEndTime());
                overlapping.removeIf(tb -> tb.getId().equals(id));
                
                if (!overlapping.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).build();
                }
            }
            
            TimeBlock updatedTimeBlock = timeBlockService.updateTimeBlock(id, timeBlockDetails);
            return ResponseEntity.ok(new TimeBlockDTO(updatedTimeBlock));
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
    public ResponseEntity<List<TimeBlockDTO>> checkOverlap(@RequestParam String day,
                                                          @RequestParam String startTime,
                                                          @RequestParam String endTime,
                                                          @RequestParam(required = false) Long studentId) {
        try {
            DayOfWeek dayOfWeek = DayOfWeek.valueOf(day);
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);
            
            List<TimeBlock> overlapping;
            if (studentId != null) {
                overlapping = timeBlockService.checkForOverlapsForStudent(studentId, dayOfWeek, start, end);
            } else {
                overlapping = timeBlockService.checkForOverlaps(dayOfWeek, start, end);
            }
            
            List<TimeBlockDTO> overlappingDTOs = overlapping.stream()
                    .map(TimeBlockDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(overlappingDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/type-colors")
    public ResponseEntity<Map<String, String>> getTypeColors() {
        Map<String, String> typeColors = timeBlockService.getTypeColors();
        return ResponseEntity.ok(typeColors);
    }
    
    // Legacy endpoint for backwards compatibility
    @GetMapping("/legacy/day/{day}")
    public ResponseEntity<List<TimeBlock>> getTimeBlocksByDayLegacy(@PathVariable String day) {
        List<TimeBlock> timeBlocks = timeBlockService.checkForOverlaps(day, "00:00:00", "23:59:59");
        return ResponseEntity.ok(timeBlocks);
    }
}
