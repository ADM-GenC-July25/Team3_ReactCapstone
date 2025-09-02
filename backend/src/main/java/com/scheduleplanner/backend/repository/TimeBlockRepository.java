package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.model.TimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeBlockRepository extends JpaRepository<TimeBlock, Integer> {
    
    // Find time blocks by day
    List<TimeBlock> findByDay(String day);
    
    // Find time blocks by type
    List<TimeBlock> findByType(String type);
    
    // Find time blocks by day and type
    List<TimeBlock> findByDayAndType(String day, String type);
    
    // Custom query to find overlapping time blocks
    @Query("SELECT tb FROM TimeBlock tb WHERE tb.day = :day AND " +
           "((tb.startTime <= :startTime AND tb.endTime > :startTime) OR " +
           "(tb.startTime < :endTime AND tb.endTime >= :endTime) OR " +
           "(tb.startTime >= :startTime AND tb.endTime <= :endTime))")
    List<TimeBlock> findOverlappingTimeBlocks(@Param("day") String day, 
                                            @Param("startTime") String startTime, 
                                            @Param("endTime") String endTime);
}
