package com.example.demo.src.java.com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");

        Conexion conexion = Conexion.getInstance();    
        conexion.Conectada();
        conexion.Desconexion();
        
    }
    
}

