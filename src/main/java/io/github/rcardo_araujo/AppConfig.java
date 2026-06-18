package io.github.rcardo_araujo;

import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppConfig {
    private String authorEmail;
    private String dummyRepoPath;
    private ArrayList<String> reposToWatch;

    @Override
    public String toString() {
        return "authorEmail: " + authorEmail +
            "\ndummyRepoPath: " + dummyRepoPath +
            "\nreposToWatch: " + reposToWatch.toString();
    }
}
