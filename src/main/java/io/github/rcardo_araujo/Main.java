package io.github.rcardo_araujo;

import io.github.rcardo_araujo.Config;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import com.google.gson.Gson;

public class Main {
    public static void main(String[] args) {
        final String configPath = "config.json";

        com.google.gson.Gson gson = new Gson();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(configPath));

            Config config = gson.fromJson(reader, Config.class);
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }
}
