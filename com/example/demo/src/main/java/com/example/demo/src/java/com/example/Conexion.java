package com.example.demo.src.java.com.example;

public class Conexion {
    private static Conexion conex;

    private Conexion() {
    }

 
    public static Conexion getInstance() {
        if (conex == null) {
            conex = new Conexion();
        }
        return conex;
    }

    public void Conectada() {
        System.out.println("Se conecto...");
    }

    public void Desconexion() {
        System.out.println("Se desconecto...");
    }

    
}
