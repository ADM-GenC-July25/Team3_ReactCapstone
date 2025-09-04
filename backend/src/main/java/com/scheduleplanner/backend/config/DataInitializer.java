package com.scheduleplanner.backend.config;

import com.scheduleplanner.backend.model.TimeBlock;
import com.scheduleplanner.backend.repository.TimeBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TimeBlockRepository timeBlockRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize data if database is empty
        if (timeBlockRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
        TimeBlock chessClub = new TimeBlock(
            "Chess Club",
            "Monday",
            "15:30",
            "17:00",
            "club",
            "Weekly chess club meeting",
            "#9C27B0"
        );

        TimeBlock partTimeJob = new TimeBlock(
            "Part-time Job",
            "Wednesday",
            "14:00",
            "18:00",
            "job",
            "Customer service at local store",
            "#FF5722"
        );

        TimeBlock studyBreak = new TimeBlock(
            "Study Break",
            "Friday",
            "12:00",
            "13:00",
            "break",
            "Lunch and relaxation",
            "#4CAF50"
        );

        TimeBlock gymSession = new TimeBlock(
            "Gym Session",
            "Tuesday",
            "18:00",
            "19:30",
            "personal",
            "Evening workout",
            "#FF9800"
        );

        timeBlockRepository.save(chessClub);
        timeBlockRepository.save(partTimeJob);
        timeBlockRepository.save(studyBreak);
        timeBlockRepository.save(gymSession);

        System.out.println("Sample time blocks initialized!");
    }
}
