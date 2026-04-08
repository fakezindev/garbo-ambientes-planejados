# ==========================================
# Estágio 1: Build (Compila o Java)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY pom.xml .
COPY src ./src

# Roda o comando do Maven para gerar o arquivo .jar
RUN mvn clean package -DskipTests

# ==========================================
# Estágio 2: Run (Roda a aplicação na Nuvem)
# ==========================================
FROM eclipse-temurin:21-jre
WORKDIR /app

# Pega o arquivo .jar gerado no passo anterior e joga pro servidor
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão
EXPOSE 8080

# Comando de start (O mesmo que você faria no terminal)
ENTRYPOINT ["java", "-jar", "app.jar"]