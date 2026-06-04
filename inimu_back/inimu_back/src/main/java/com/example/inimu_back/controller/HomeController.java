package com.example.inimu_back.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String root() {
        return "redirect:/todo";
    }

    @GetMapping("/todo")
    public String todo() {
        return "forward:/index.html";
    }
}
