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
            ArrayList<String> logs = gitService.getLog(repo, appConfig.getAuthorEmail());

            for (String log: logs) {
                String[] commitArguments = log.split(" ", 2);
                String commitDate = commitArguments[0];
                String commitMessage = commitArguments[1];

                gitService.commit(appConfig.getDummyRepoPath(), commitMessage, commitDate);
            }
        }
    }
}
