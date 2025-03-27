# Dockerfile for .NET API (place in API directory)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy all files and build the app
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Create data directory for SQLite
RUN mkdir -p /app/data
RUN chmod 755 /app/data

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "API.dll"]
