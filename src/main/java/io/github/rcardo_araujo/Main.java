package io.github.rcardo_araujo;

import io.github.rcardo_araujo.AppConfig;
import io.github.rcardo_araujo.GitService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.InterruptedException;
import java.lang.Process;
import java.lang.ProcessBuilder;
import java.util.ArrayList;
import com.google.gson.Gson;

public class Main {
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

        GitService gitService = new GitService();

        for (String repo: appConfig.getReposToWatch()) {
            try {    
                String sinceDate = "2026-06-01";

                ProcessBuilder processBuilder = new ProcessBuilder(
                    "git", 
                    "log", 
                    "--author=" + appConfig.getAuthorEmail(),
                    "--since=" + sinceDate,
                    "--pretty=format:%aI %s"
                ).directory(new File(repo));

                Process process = processBuilder.start();

                ArrayList<String> terminalLines = new ArrayList<String>();

                try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
                )) {
                    String line;

                    while ((line = reader.readLine()) != null) {
                        terminalLines.add(line);
                    }
                }

                int exitCode = process.waitFor();

                for (String line: terminalLines) {
                    System.out.println(line);

                    String[] commitArguments = line.split(" ", 2);
                    String commitDate = commitArguments[0];
                    String commitMessage = commitArguments[1];

                    gitService.commit(appConfig.getDummyRepoPath(), commitMessage, commitDate);
                }

                System.out.println("\nProcess finished with code: " + exitCode);

            } catch (IOException | InterruptedException exception) {
                exception.printStackTrace();
            }
        }
    }
}
