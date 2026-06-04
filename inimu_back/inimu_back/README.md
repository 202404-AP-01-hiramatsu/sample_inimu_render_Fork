# inimu_back

inimu の LP と予約APIを1つの Spring Boot アプリで動かすプロジェクトです。

## 起動方法

```bash
./mvnw spring-boot:run
```

Windows の場合:

```bash
mvnw.cmd spring-boot:run
```

## ローカル確認手順

1. `mvnw.cmd clean package -DskipTests`
2. `mvnw.cmd spring-boot:run`
3. `http://localhost:8080/` でLPを確認
4. `http://localhost:8080/h2-console` でDBを確認

## 確認URL

- LP: http://localhost:8080/
- H2 Console: http://localhost:8080/h2-console
- 予約登録: `POST http://localhost:8080/api/reservations`
- 予約一覧: `GET http://localhost:8080/api/reservations`
- 予約詳細: `GET http://localhost:8080/api/reservations/{id}`

## Postman確認手順

### 予約登録

`POST /api/reservations`

リクエストボディ例:

```json
{
  "name": "山田太郎",
  "email": "taro@example.com",
  "preferredDate": "土曜 13:00",
  "people": 2,
  "message": "初めて参加します"
}
```

### 予約一覧

`GET /api/reservations`

### 予約詳細

`GET /api/reservations/1`

### バリデーションエラー確認

`POST /api/reservations`

```json
{
  "name": "",
  "email": "invalid-email",
  "preferredDate": "",
  "people": 0,
  "message": ""
}
```

## H2 Console

- JDBC URL: `jdbc:h2:mem:inimudb`
- User Name: `sa`
- Password: 空欄

## curl確認例

### 予約登録

```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"山田太郎\",\"email\":\"taro@example.com\",\"preferredDate\":\"土曜 13:00\",\"people\":2,\"message\":\"初めて参加します\"}"
```

### 予約一覧

```bash
curl http://localhost:8080/api/reservations
```

### バリデーションエラー

```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"\",\"email\":\"invalid-email\",\"preferredDate\":\"\",\"people\":0,\"message\":\"\"}"
```

## Render デプロイ時の注意点

- このアプリは `server.port=${PORT:8080}` に対応しています。
- Render では 1 つの Web Service として起動してください。
- Dockerfile を使って Java 21 でビルド・実行します。
- LP は `src/main/resources/static` 配下の静的ファイルをそのまま配信します。

## 次のステップ

- Render公開
- MySQL化
