package com.example.inimu_back.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReservationRequest {

    @NotBlank(message = "お名前は必須です。")
    @Size(max = 50, message = "お名前は50文字以内で入力してください。")
    private String name;

    @NotBlank(message = "メールアドレスは必須です。")
    @Email(message = "メールアドレスの形式が正しくありません。")
    @Size(max = 100, message = "メールアドレスは100文字以内で入力してください。")
    private String email;

    @NotBlank(message = "希望日時は必須です。")
    @Size(max = 100, message = "希望日時は100文字以内で入力してください。")
    private String preferredDate;

    @NotNull(message = "参加人数は必須です。")
    @Min(value = 1, message = "参加人数は1以上で入力してください。")
    @Max(value = 6, message = "参加人数は6以下で入力してください。")
    private Integer people;

    @Size(max = 1000, message = "お問い合わせ内容は1000文字以内で入力してください。")
    private String message;

    public ReservationRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public Integer getPeople() {
        return people;
    }

    public void setPeople(Integer people) {
        this.people = people;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
