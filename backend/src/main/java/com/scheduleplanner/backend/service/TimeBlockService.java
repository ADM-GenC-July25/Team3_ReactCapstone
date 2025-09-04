package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.model.TimeBlock.DayOfWeek;
import com.scheduleplanner.backend.repository.TimeBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class TimeBlockService {
    
    @Autowired
    private TimeBlockRepository timeBlockRepository;
    
    // Type to color mapping
    private static final Map<String, String> TYPE_COLORS = new HashMap<>();
    
    static {
        TYPE_COLORS.put("club", "#9C27B0");
        TYPE_COLORS.put("job", "#FF5722");
        TYPE_COLORS.put("break", "#4CAF50");
        TYPE_COLORS.put("personal", "#FF9800");
        TYPE_COLORS.put("other", "#607D8B");
    }
    
    public List<TimeBlock> getAllTimeBlocks() {
        return timeBlockRepository.findAll();
    }
    
    public Optional<TimeBlock> getTimeBlockById(Long id) {
        return timeBlockRepository.findById(id);
    }
    
    public List<TimeBlock> getTimeBlocksByDay(DayOfWeek day) {
        return timeBlockRepository.findByDay(day);
    }
    
    public List<TimeBlock> getTimeBlocksByType(String type) {
        return timeBlockRepository.findByType(type);
    }
    
    public List<TimeBlock> getTimeBlocksByStudentId(Long studentId) {
        return timeBlockRepository.findByStudentId(studentId);
    }
    
    public List<TimeBlock> getTimeBlocksByStudentIdAndDay(Long studentId, DayOfWeek day) {
        return timeBlockRepository.findByStudentIdAndDay(studentId, day);
    }
    
    public List<TimeBlock> getTimeBlocksByStudentIdAndType(Long studentId, String type) {
        return timeBlockRepository.findByStudentIdAndType(studentId, type);
    }
    
    public List<TimeBlock> getTimeBlocksForScheduleView(Long studentId) {
        return timeBlockRepository.findTimeBlocksForScheduleView(studentId);
    }
    
    public TimeBlock createTimeBlock(TimeBlock timeBlock) {
        // Set color based on type if not provided
        if (timeBlock.getColor() == null || timeBlock.getColor().isEmpty()) {
            timeBlock.setColor(TYPE_COLORS.getOrDefault(timeBlock.getType(), TYPE_COLORS.get("other")));
        }
        
        return timeBlockRepository.save(timeBlock);
    }
    
    public TimeBlock updateTimeBlock(Long id, TimeBlock timeBlockDetails) {
        TimeBlock timeBlock = timeBlockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeBlock not found with id: " + id));
        
        timeBlock.setTitle(timeBlockDetails.getTitle());
        timeBlock.setDay(timeBlockDetails.getDay());
        timeBlock.setStartTime(timeBlockDetails.getStartTime());
        timeBlock.setEndTime(timeBlockDetails.getEndTime());
        timeBlock.setType(timeBlockDetails.getType());
        timeBlock.setWeeks(timeBlockDetails.getWeeks());
        timeBlock.setDescription(timeBlockDetails.getDescription());
        timeBlock.setStudentId(timeBlockDetails.getStudentId());
        
        // Update color based on type if not provided
        if (timeBlockDetails.getColor() == null || timeBlockDetails.getColor().isEmpty()) {
            timeBlock.setColor(TYPE_COLORS.getOrDefault(timeBlockDetails.getType(), TYPE_COLORS.get("other")));
        } else {
            timeBlock.setColor(timeBlockDetails.getColor());
        }
        
        return timeBlockRepository.save(timeBlock);
    }
    
    public void deleteTimeBlock(Long id) {
        TimeBlock timeBlock = timeBlockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeBlock not found with id: " + id));
        timeBlockRepository.delete(timeBlock);
    }
    
    public List<TimeBlock> checkForOverlaps(DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        return timeBlockRepository.findOverlappingTimeBlocks(day, startTime, endTime);
    }
    
    public List<TimeBlock> checkForOverlapsForStudent(Long studentId, DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        return timeBlockRepository.findOverlappingTimeBlocksForStudent(studentId, day, startTime, endTime);
    }
    
    // Legacy method for backwards compatibility (converts String to DayOfWeek and String to LocalTime)
    public List<TimeBlock> checkForOverlaps(String day, String startTime, String endTime) {
        try {
            DayOfWeek dayOfWeek = DayOfWeek.valueOf(day);
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);
            return checkForOverlaps(dayOfWeek, start, end);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid day or time format", e);
        }
    }
    
    public Map<String, String> getTypeColors() {
        return new HashMap<>(TYPE_COLORS);
    }
}
