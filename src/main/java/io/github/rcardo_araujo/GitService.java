package io.github.rcardo_araujo;

import java.io.File;
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
