package io.github.rcardo_araujo;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.ArrayList;

import com.google.gson.Gson;

public class KeepItGreenApp {
    public static void main(String[] args) {
        final String configPath = "config.json";

        Gson gson = new Gson();
        AppConfig appConfig = new AppConfig();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(configPath));

            appConfig = gson.fromJson(reader, AppConfig.class);
            
        } catch(IOException exception) {
            exception.printStackTrace();
        }

        Path lastSyncPath = Paths.get("last_sync.txt");
        String sinceDate = "";

        if (!Files.exists(lastSyncPath)) {
            try {
                Files.createFile(lastSyncPath);

                sinceDate = "2026-06-01T00:00:00-03:00";

            } catch (IOException exception) {
                exception.printStackTrace();
            }
        } else {
            try {
                sinceDate = Files.readString(lastSyncPath).trim();

            } catch (IOException exception) {
                exception.printStackTrace();
            }
        }

        try {
            String syncTimestamp = OffsetDateTime.now().toString();
            Files.writeString(lastSyncPath, syncTimestamp);

        } catch (IOException exception) {
            exception.printStackTrace();
        }

        GitClient gitService = new GitClient();

        for (String repo: appConfig.getSourceRepoPaths()) {
            ArrayList<String> logs = gitService.fetchCommits(repo, appConfig.getAuthorEmail(), sinceDate);

            for (String log: logs) {
                String[] commitArguments = log.split(" ", 2);
                String commitDate = commitArguments[0];
                String commitMessage = commitArguments[1];

                gitService.commitEmpty(appConfig.getDestinationRepoPath(), commitMessage, commitDate);
                gitService.push(appConfig.getDestinationRepoPath());
            }
        }
    }
}
