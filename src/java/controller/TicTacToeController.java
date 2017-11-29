/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Martin
 */
@RestController
@RequestMapping("/jugar")
public class TicTacToeController {

    @RequestMapping(value = "juego", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    String siguienteJugada(@RequestParam("tablero") String tablero) {

        Gson gson = new Gson();
        gson.htmlSafe();

        HashMap<String, Integer> board = new HashMap<>();
        java.lang.reflect.Type stringStringMap = new com.google.gson.reflect.TypeToken<HashMap<String, Integer>>() {
        }.getType();
        board = gson.fromJson(tablero, stringStringMap);

        Iterator it = board.keySet().iterator();

        List<String> disponibles = new ArrayList<>();

        while (it.hasNext()) {
            String key = (String) it.next();
            Integer value = board.get(key);
            System.out.println(value);

            if (value.equals(0)) {
                disponibles.add(key);
            }
        }
        
        HashMap<String, String> respuesta = new HashMap<>();
        
        if(disponibles.size() > 0) {
            //Casilla random
            int casillaRandom = (int) Math.random() * disponibles.size();
            respuesta.put("status", "true");
            respuesta.put("cell", disponibles.get(casillaRandom));
            return gson.toJson(respuesta);
        }
        
        respuesta.put("status", "false");
        return gson.toJson(respuesta);
    }

}
