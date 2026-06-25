package io.github.rcardo_araujo;

import java.util.ArrayList;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppConfig {
    private String authorEmail;
    private String destinationRepoPath;
    private ArrayList<String> sourceRepoPaths;

    @Override
    public String toString() {
        return "authorEmail: " + authorEmail +
            "\ndummyRepoPath: " + destinationRepoPath +
            "\nreposToWatch: " + sourceRepoPaths.toString();
    }
}
