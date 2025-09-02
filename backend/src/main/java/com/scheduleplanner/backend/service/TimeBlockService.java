package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.repository.TimeBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    
    public Optional<TimeBlock> getTimeBlockById(Integer id) {
        return timeBlockRepository.findById(id);
    }
    
    public List<TimeBlock> getTimeBlocksByDay(String day) {
        return timeBlockRepository.findByDay(day);
    }
    
    public List<TimeBlock> getTimeBlocksByType(String type) {
        return timeBlockRepository.findByType(type);
    }
    
    public TimeBlock createTimeBlock(TimeBlock timeBlock) {
        // Set color based on type if not provided
        if (timeBlock.getColor() == null || timeBlock.getColor().isEmpty()) {
            timeBlock.setColor(TYPE_COLORS.getOrDefault(timeBlock.getType(), TYPE_COLORS.get("other")));
        }
        
        return timeBlockRepository.save(timeBlock);
    }
    
    public TimeBlock updateTimeBlock(Integer id, TimeBlock timeBlockDetails) {
        TimeBlock timeBlock = timeBlockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeBlock not found with id: " + id));
        
        timeBlock.setTitle(timeBlockDetails.getTitle());
        timeBlock.setDay(timeBlockDetails.getDay());
        timeBlock.setStartTime(timeBlockDetails.getStartTime());
        timeBlock.setEndTime(timeBlockDetails.getEndTime());
        timeBlock.setType(timeBlockDetails.getType());
        timeBlock.setDescription(timeBlockDetails.getDescription());
        
        // Update color based on type if not provided
        if (timeBlockDetails.getColor() == null || timeBlockDetails.getColor().isEmpty()) {
            timeBlock.setColor(TYPE_COLORS.getOrDefault(timeBlockDetails.getType(), TYPE_COLORS.get("other")));
        } else {
            timeBlock.setColor(timeBlockDetails.getColor());
        }
        
        return timeBlockRepository.save(timeBlock);
    }
    
    public void deleteTimeBlock(Integer id) {
        TimeBlock timeBlock = timeBlockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeBlock not found with id: " + id));
        timeBlockRepository.delete(timeBlock);
    }
    
    public List<TimeBlock> checkForOverlaps(String day, String startTime, String endTime) {
        return timeBlockRepository.findOverlappingTimeBlocks(day, startTime, endTime);
    }
    
    public Map<String, String> getTypeColors() {
        return new HashMap<>(TYPE_COLORS);
    }
}
