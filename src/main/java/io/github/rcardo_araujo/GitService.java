package io.github.rcardo_araujo;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.Process;
import java.lang.ProcessBuilder;
import java.util.ArrayList;

public class GitService {
    public ArrayList<String> getLog(String repository, String author) {
        ArrayList<String> terminalLines = new ArrayList<String>();

        String sinceDate = "2026-06-01";

        try {    
            ProcessBuilder processBuilder = new ProcessBuilder(
                "git", 
                "log", 
                "--author=" + author,
                "--since=" + sinceDate,
                "--pretty=format:%aI %s"
            ).directory(new File(repository));

            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            )) {
                String line;

                while ((line = reader.readLine()) != null) {
                    terminalLines.add(line);
                }
            }

            int exitCode = process.waitFor();

        } catch (IOException | InterruptedException exception) {
            exception.printStackTrace();
        }

        return terminalLines;
    }

    public void commit(String directory, String message, String date) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                "git",
                "commit",
                "--allow-empty",
                "-m",
                (message != null) ? message : "ghost commit",
                "--date=" + date
            ).directory(new File(directory));

            Process process = processBuilder.start();

            int exitCode = process.waitFor();

        } catch (IOException | InterruptedException exception) {
            exception.printStackTrace();
        }
    }
}
