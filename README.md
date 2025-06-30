# 🎮 Tic Tac Toe Avanzado

Un juego de Tic Tac Toe moderno y completo desarrollado con React, TypeScript y Tailwind CSS. Incluye modo multijugador, inteligencia artificial, efectos de sonido, estadísticas persistentes y una interfaz elegante con temas claro y oscuro.

## ✨ Características

### 🎯 Modos de Juego
- **Modo 2 Jugadores (PvP)**: Juega contra un amigo en el mismo dispositivo
- **Modo vs IA (PvC)**: Enfrenta a una inteligencia artificial con 3 niveles de dificultad
  - **Fácil**: IA con movimientos aleatorios
  - **Medio**: IA estratégica con 70% de jugadas inteligentes
  - **Difícil**: IA óptima usando algoritmo Minimax con poda alfa-beta

### 🎵 Sistema de Audio Avanzado
- Sonidos de hover y clic en las celdas
- Sistema de tensión progresiva cuando el tiempo se agota
- Sonido de advertencia a los 5 segundos
- Efectos de audio para victoria, empate y nuevo juego
- Control de volumen ajustable

### ⏱️ Sistema de Tiempo
- Temporizador configurable por turno (5-30 segundos)
- Indicadores visuales de tiempo crítico
- Barra de progreso con animaciones
- Solo aplica para jugadores humanos (la IA no tiene límite de tiempo)

### 📊 Estadísticas Completas
- Seguimiento de victorias, empates y derrotas
- Estadísticas separadas para modo PvP y vs IA
- Historial de las últimas 10 partidas
- Rachas de victorias
- Tiempo promedio de juego
- Datos persistentes en localStorage

### 🎨 Interfaz y Experiencias
- Temas claro y oscuro
- Efectos de partículas en victorias
- Animaciones suaves y micro-interacciones
- Diseño responsivo para todos los dispositivos
- Indicadores visuales para líneas ganadoras
- Estados de tensión visual cuando el tiempo se agota

### ⚙️ Configuración Personalizable
- Modo de juego (PvP/PvC)
- Dificultad de la IA
- Tiempo por turno
- Activar/desactivar sonidos
- Control de volumen
- Tema visual
- Efectos de partículas

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Herramienta de construcción rápida
- **Lucide React** - Iconos modernos
- **Web Audio API** - Generación de sonidos en tiempo real
- **localStorage** - Persistencia de datos local

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio
cd tic-tac-toe

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la construcción
npm run lint     # Verificar código con ESLint
```

## 🎮 Cómo Jugar

### Modo 2 Jugadores
1. Selecciona "2 Jugadores" en la configuración
2. Los jugadores se turnan haciendo clic en las celdas vacías
3. El primer jugador es X, el segundo es O
4. Gana quien conecte 3 símbolos en línea (horizontal, vertical o diagonal)
5. Cada jugador tiene un tiempo límite por turno (configurable)

### Modo vs IA
1. Selecciona "vs IA" en la configuración
2. Elige la dificultad deseada
3. Tú juegas como X (siempre empiezas primero)
4. La IA juega como O
5. Solo tu tiempo está limitado, la IA piensa sin prisa

### Controles
- **Clic**: Hacer una jugada
- **Botón de configuración**: Acceder a todas las opciones
- **Nuevo Juego**: Reiniciar la partida actual
- **Reiniciar Estadísticas**: Borrar todos los datos guardados

## 🧠 Algoritmo de IA

La inteligencia artificial utiliza diferentes estrategias según la dificultad:

- **Fácil**: Movimientos completamente aleatorios
- **Medio**: Combinación de estrategia (70%) y aleatoriedad (30%)
  - Prioriza ganar si es posible
  - Bloquea al jugador si está a punto de ganar
  - Prefiere el centro y las esquinas
- **Difícil**: Algoritmo Minimax con poda alfa-beta
  - Juego perfecto, imposible de ganar
  - Evalúa todos los movimientos posibles
  - Optimizado para rendimiento

## 📱 Características Técnicas

### Arquitectura
- Componentes funcionales con hooks
- Estado global manejado con Context API implícito
- Separación clara de lógica de negocio y presentación
- Tipado estricto con TypeScript

### Rendimiento
- Componentes optimizados con React.memo donde es necesario
- Debounce en efectos de sonido
- Lazy loading de efectos visuales
- Minimización de re-renders

### Accesibilidad
- Etiquetas ARIA para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado
- Indicadores visuales claros

## 🎨 Personalización

El juego está diseñado para ser fácilmente personalizable:

- **Colores**: Modifica las clases de Tailwind en los componentes
- **Sonidos**: Ajusta las frecuencias en `useAudio.ts`
- **Tiempos**: Cambia los valores por defecto en `useSettings.ts`
- **IA**: Modifica la lógica en `aiPlayer.ts`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio.

---

**¡Disfruta jugando! 🎉**