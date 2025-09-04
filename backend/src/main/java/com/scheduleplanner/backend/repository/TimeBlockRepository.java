package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.model.TimeBlock.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeBlockRepository extends JpaRepository<TimeBlock, Long> {
    
    // Find time blocks by day
    List<TimeBlock> findByDay(DayOfWeek day);
    
    // Find time blocks by type
    List<TimeBlock> findByType(String type);
    
    // Find time blocks by student ID
    List<TimeBlock> findByStudentId(Long studentId);
    
    // Find time blocks by student ID and day
    List<TimeBlock> findByStudentIdAndDay(Long studentId, DayOfWeek day);
    
    // Find time blocks by day and type
    List<TimeBlock> findByDayAndType(DayOfWeek day, String type);
    
    // Find time blocks by student ID and type
    List<TimeBlock> findByStudentIdAndType(Long studentId, String type);
    
    // Custom query to find overlapping time blocks for a specific student
    @Query("SELECT tb FROM TimeBlock tb WHERE tb.studentId = :studentId AND tb.day = :day AND " +
           "((tb.startTime <= :startTime AND tb.endTime > :startTime) OR " +
           "(tb.startTime < :endTime AND tb.endTime >= :endTime) OR " +
           "(tb.startTime >= :startTime AND tb.endTime <= :endTime))")
    List<TimeBlock> findOverlappingTimeBlocksForStudent(@Param("studentId") Long studentId,
                                                       @Param("day") DayOfWeek day, 
                                                       @Param("startTime") LocalTime startTime, 
                                                       @Param("endTime") LocalTime endTime);
    
    // Custom query to find overlapping time blocks (general - for all students)
    @Query("SELECT tb FROM TimeBlock tb WHERE tb.day = :day AND " +
           "((tb.startTime <= :startTime AND tb.endTime > :startTime) OR " +
           "(tb.startTime < :endTime AND tb.endTime >= :endTime) OR " +
           "(tb.startTime >= :startTime AND tb.endTime <= :endTime))")
    List<TimeBlock> findOverlappingTimeBlocks(@Param("day") DayOfWeek day, 
                                            @Param("startTime") LocalTime startTime, 
                                            @Param("endTime") LocalTime endTime);
    
    // Query to get all time blocks for schedule view (matching your SQL query)
    @Query("SELECT tb FROM TimeBlock tb WHERE tb.studentId = :studentId ORDER BY tb.day, tb.startTime")
    List<TimeBlock> findTimeBlocksForScheduleView(@Param("studentId") Long studentId);
}
