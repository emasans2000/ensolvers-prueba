# Proyecto NoteApp

Este proyecto contiene una aplicación web que tiene tanto un backend como un frontend. El backend se encarga de las operaciones de base de datos y la lógica de la aplicación, mientras que el frontend es responsable de la interfaz de usuario.

## Requisitos

### Requisitos de software

1. **PostgreSQL**:
    - Asegúrate de tener PostgreSQL instalado en tu máquina.
    - Debes tener acceso a una base de datos PostgreSQL para que la aplicación funcione correctamente.

2. **Node.js**:
    - Debes tener instalada la versión **LTS** de Node.js.
    - Puedes verificar si tienes Node.js instalado ejecutando:
      ```bash
      node -v
      ```

3. **Dotnet SDK**:
    - Asegúrate de tener instalado el **.NET 9 SDK** adecuado para ejecutar el backend. La aplicación está diseñada para ejecutarse con **.NET 9.0**.
    - Puedes verificar si tienes .NET instalado ejecutando:
      ```bash
      dotnet --version
      ```

4. **jq** (para manipulación de archivos JSON):
    - Este script depende de `jq` para actualizar el archivo `appsettings.json`. Asegúrate de tenerlo instalado.
    - Si estás en Windows, puedes instalarlo con el siguiente comando:
      ```bash
      curl -L -o /usr/bin/jq.exe https://github.com/jqlang/jq/releases/latest/download/jq-win64.exe
      ```
      o bien:
      choco install jq
    - 
    - En Linux/macOS, puedes instalarlo con:
      ```bash
      sudo apt-get install jq
      ```

### Dependencias del proyecto

- **Backend**:
    - **Entity Framework Core**: Para gestionar las migraciones y la base de datos.
    - **Swagger**: SwaggerGen, SwaggerUI, Swagger
    - **Npgsql**: Proveedor de PostgreSQL para Entity Framework Core.

## Instalación

### 1. Clona el repositorio

Primero, clona el repositorio en tu máquina local:

```bash
luego de clonar el repositorio desde bash debera:
cd ensolvers-prueba
./deploylocal.sh

