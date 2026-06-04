FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the nested project files needed for Maven build
COPY inimu_back/inimu_back/pom.xml ./
COPY inimu_back/inimu_back/.mvn ./.mvn
COPY inimu_back/inimu_back/mvnw .
COPY inimu_back/inimu_back/mvnw.cmd .
COPY inimu_back/inimu_back/src ./src

RUN chmod +x ./mvnw && ./mvnw -q package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar app.jar"]
