# 📘 Documentación Completa — **App Agenda v2**

Aplicación de escritorio diseñada para llevar el control financiero personal de modelos webcam, con seguimiento quincenal, manejo de porcentajes, aranceles, préstamos, adelantos y conversión de monedas.

---

## 📌 **Descripción General del Proyecto**

La **App Agenda** es una herramienta creada para que una modelo webcam pueda administrar sus ingresos diarios y llevar un registro claro de sus ganancias, deudas, rendimientos quincenales y metas financieras.

El propósito principal es simplificar el proceso de contabilidad personal del trabajo webcam, considerando todos los factores que afectan el pago final.

La aplicación también es útil para estudios que deseen hacer seguimiento de ingresos de una modelo.

---

## 🎯 **Objetivos Principales**

* Mantener las cuentas personales de una modelo, centralizando toda la información en un solo lugar.
* Generar promedios y resúmenes quincenales automáticos.
* Controlar préstamos, adelantos y descuentos aplicados por el estudio.
* Registrar el rendimiento diario de cada página donde la modelo trabaja.
* Calcular automáticamente aranceles, porcentajes del estudio y retenciones.
* Convertir la moneda según la forma de pago de la página: **coins, USD, EUR o GBP**.
* Detectar cuándo la modelo pidió más dinero del que ganó y generar un saldo negativo (**rojo**) aplicando un interés del 5%.
* Ayudar a establecer metas y dar seguimiento al avance quincenal.

---

## 🧩 **Características Principales**

### **1. Registro de Páginas de Trabajo**

Incluye:

* Nombre de la página.
* Tipo de moneda utilizada.
* Descuentos que aplica la página.
* Sistema de comisiones.

### **2. Configuración Financiera de la Modelo**

Gestiona:

* Porcentaje que se queda el estudio.
* Aranceles o retenciones del gobierno.
* Métodos de pago.
* Notas personalizadas.

### **3. Control de Adelantos, Préstamos y Descuentos**

Permite:

* Registrar adelantos otorgados por el estudio.
* Controlar préstamos a largo o corto plazo.
* Restar automáticamente al pago final.
* Aplicar interés del 5% si el saldo queda en rojo.

### **4. Registro Diario**

La modelo puede:

* Registrar lo trabajado en el día.
* Asignar valores por página.
* Ver totales acumulados.

### **5. Cierres y Reportes Quincenales**

Incluyen:

* Total trabajado por página.
* Total ganado después de descuentos.
* Comparación con metas.
* Promedio diario de la quincena.
* Deuda generada o saldo restante.

### **6. Conversión de Monedas**

El sistema maneja equivalencias dependiendo de:

* Coins → USD
* EUR → COP
* GBP → COP
* USD → COP

Los valores se convierten automáticamente según la configuración.

---

## 🏛️ **Arquitectura General**

La app sigue un enfoque modular, usando una combinación de:

* **Electron** para creación de aplicación de escritorio.
* **Vite + React** para el frontend.
* **Node.js (CommonJS)** para la lógica del backend.
* **SQLite** como base de datos local persistente.
* Comunicación mediante **ipcMain / ipcRenderer**.

---

## 🔧 **Tecnologías Utilizadas**

| Componente        | Tecnología                  |
| ----------------- | --------------------------- |
| Frontend          | React + Vite                |
| Estilos           | TailwindCSS                 |
| Desktop           | Electron                    |
| Backend           | Node.js (CJS)               |
| DB local          | SQLite                      |
| Control de estado | Hooks / Context (si aplica) |

---

## 📂 **Estructura del Proyecto (Resumen)**

```
app-Agenda/
│
│-- electron/
│   │
│   ├── controller/
│   │      ├── processors/
│   │      │       ├── cleaners
│   │      │       ├── constants
│   │      │       ├── diasProcessor
│   │      │       ├── formatearQuincenaCompleta
│   │      │       ├── getDB
│   │      │       ├── handlers
│   │      │       ├── helpers
│   │      │       └── index
│   │      │
│   │      ├── Aranceles
│   │      ├── cerradoQ
│   │      ├── day
│   │      ├── getQData
│   │      ├── moneda
│   │      ├── page
│   │      └── quincena
│   │
│   ├── ipcMain/
│   │      └── ipcMain.cjs          # Handlers de comunicación con el frontend
│   │
│   ├── models/
│   │      ├── Aranceles
│   │      ├── CerradoA              # sin funcionalidad
│   │      ├── CerradoM              # sin funcionalidad
│   │      ├── CerradoQ
│   │      ├── Day
│   │      ├── Moneda
│   │      ├── Page
│   │      └── Quincena
│   │
│   ├── main.cjs                     # Configuración principal de Electron
│   ├── db.cjs                       # Conexión y manejo de SQLite
│   ├── preload/                     # Handlers de comunicacion con electron
│   └── public/                      # .ico e imageneres
│
│-- src/
│   │
│   ├── components/                  # Componentes UI
│   │
│   ├── plugin/                      # componentes y logica reutilizable
│   │      ├── ErrorAlert
│   │      ├── NavBar
│   │      ├── YearQuincenaPagoCierreCabecera
│   │      ├── YearQuincenaSelector
│   │      └── YearQuincenaSelectorCabecera
│   │
│   ├── utils/                        # Formularios
│   │      ├── createAranceles
│   │      ├── CreateDia
│   │      ├── CreateMoneda
│   │      ├── CreatePage
│   │      └── Quincena
│   │
│   └── view/                         # Vistas principales
│          ├── Aranceles
│          ├── Dias
│          ├── Home
│          └── Page
│
│-- App.jsx                               
│-- data.js                               # Manejo de  fechas logica reutilizable
│-- index.css                             
│-- main.jsx                              
│-- index.html                            
│-- package.json                          
│-- electron-builder.config.js
│-- documentacion.md
│-- vite.config.js
│
└── README.md
```

---

## 🔢 **Cálculos Importantes Dentro de la App**

### **Ganancia final por día (ejemplo simplificado)**

```
Ganancia_neta = (Valor_paginas - Descuentos_pagina)
                 - (Porcentaje_estudio)
                 - (Arancel_gobierno)
```

### **Saldo final quincenal**

```
Saldo_final = Ganancia_total - Adelantos - Préstamos
```

### **Si el saldo final es negativo:**

```
Deuda = |Saldo_final| + (5% de interés)
```

---

## 👤 **Usuarios Objetivo**

* Modelos webcam independientes.
* Modelos que trabajan con estudio y desean transparencia.
* Estudios que necesitan controlar ingresos por modelo.
* Personas que quieren llevar registro de metas y rendimiento.

---

## 🚀 **Propósito General de la App**

La aplicación está pensada para **organizar**, **automatizar** y **visualizar** las finanzas del mundo webcam de forma simple, clara y transparente. Solo registrando lo trabajado en el día, la modelo puede tener un panorama completo de:

* Lo que realmente gana.
* Lo que está pagando en comisiones.
* Lo que debe o le deben.
* Su progreso hacia metas personales.
* El rendimiento real quincena a quincena.

---

## 📎 **Estado Actual del Proyecto**

* Versión en desarrollo activo (**branch: v2**).
* Migración de funcionalidades y optimización en proceso.
* Estructura de módulos revisada.
* Integración de SQLite estable.

---

## 📜 **Licencia**

**todos los derechos reservados**

---

## 🧑‍💻 Autor

**Wilson San**
Full Stack Developer

---
