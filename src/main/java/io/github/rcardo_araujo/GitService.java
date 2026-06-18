package io.github.rcardo_araujo;

import java.io.IOException;
import java.lang.Process;
import java.lang.ProcessBuilder;

public class GitService {
    public void commit(String directory, String message, String date) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                "git",
                "commit",
                "--allow-empty",
                "-m",
                (message != null) ? message : "ghost commit"
            ).directory(directory);

            Process process = processBuilder.start();

        } catch (IOException | InterruptedException exception) {
            exception.printStackTrace();
        }
    }
}
