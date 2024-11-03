using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetApp
{
    internal class Program
    {
        const string NINGUNO = "0";
        const string IZQUIERDA = "1";
        const string DERECHA = "2";
        const string ARRIBA = "3";
        const string ABAJO = "4";
        const string BOTON_A = "5";
        const string BOTON_B = "6";
        const string BOTON_START = "7";

        const string WORLD = "world";
        const string KART = "kart";
        const string FOX = "fox";

        static void Main(string[] args)
        {
            while (true)
            {
                string[] comandos = Console.ReadLine().Split(',');
                string game = comandos[0];

                if (game.Equals(WORLD))
                {
                    ControlMarioWorld(comandos);
                }
                else if (game.Equals(KART))
                {
                    ControlMarioKart(comandos);
                }
                else if (game.Equals(FOX))
                {
                    ControlStarFox(comandos);
                }
            }
        }

        /**
         * Implementa el control de Super Mario World.
         * 
         * En Super Mario World, el comando "A" se interpreta como "izquierda",
         * el comando "B" se interpreta como "derecha", y el comando "X" con
         * el valor "ARRIBA" se interpreta como un salto. Los demás comandos
         * son ignorados.
         * 
         * La estructura del arreglo de comandos es la siguiente:
         * 0: juego
         * 1: movimiento en X
         * 2: movimiento en Y
         * 3: botón A (activo o inactivo)
         * 4: botón B (activo o inactivo)
         * 5: botón Start (activo o inactivo)
         */
        static void ControlMarioWorld(string[] commands)
        {
            string jump = commands[2];
            string right = commands[3];
            string left = commands[4];            

            if (left.Equals(BOTON_B))
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
            }
            else if (right.Equals(BOTON_A))
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
            }
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
            }

            if (jump.Equals(ARRIBA))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_Q);
            }
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
            }
        }

        /**
         * Implementa el control de Mario Kart
         * 
         * En Mario Kart, el comando "Y" con el valor "ARRIBA" se interpreta
         * como "acelerar", el comando "Y" con el valor "ABAJO" se interpreta
         * como "frenar", el comando "A" se interpreta como "izquierda", y el
         * comando "B" se interpreta como "derecha". Los demás comandos son
         * ignorados.
         * 
         * La estructura del arreglo de comandos es la siguiente:
         * 0: juego
         * 1: movimiento en X
         * 2: movimiento en Y
         * 3: botón A (activo o inactivo)
         * 4: botón B (activo o inactivo)
         * 5: botón Start (activo o inactivo)
         */
        static void ControlMarioKart (string[] commands)
        {
            string accel = commands[2];
            string right = commands[3];
            string left = commands[4];

            // MARIO KART
            if (left.Equals(IZQUIERDA))
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
            }
            else if (right.Equals(DERECHA))
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
            }
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
            }

            if (accel.Equals(ARRIBA))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_Q);
            }
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
            }

            if (accel.Equals(ABAJO))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
            }
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
            }
        }

        /**
         * Implementa el control de Star Fox
         * 
         * En Star Fox, el comando "X" con el valor "DERECHA" se interpreta
         * como "acelerar" y con el valor "IZQUIERDA" se considera como "frenar".
         * 
         * El comando "Y" con los valores "ARRIBA" y "ABAJO" se interpretan
         * tal cual.
         * 
         * El comando "A" se interpreta como "izquierda", y el comando "B" se
         * interpreta como "derecha".
         * 
         * Dado el tipo de juego, el blaster siempre se mantiene presionado.
         * 
         * La estructura del arreglo de comandos es la siguiente:
         * 0: juego
         * 1: movimiento en X
         * 2: movimiento en Y
         * 3: botón A (activo o inactivo)
         * 4: botón B (activo o inactivo)
         * 5: botón Start (activo o inactivo)
         */
        static void ControlStarFox(string[] commands)
        {
            // El blaster siempre se mantiene presionado
            WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_I);
            WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_I);

            string x = commands[1];
            string y = commands[2];

            // Acelerar
            if (x.Equals(IZQUIERDA))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_K);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_O);
            }
            // Frenar
            else if (x.Equals(DERECHA))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_O);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_K);
            }
            // Neutro
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_K);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_O);
            }

            // Hacia arriba
            if (y.Equals(ARRIBA))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_W);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_S);
            }
            // Hacia abajo
            else if (y.Equals(ABAJO))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_S);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_W);
            }
            // Neutral
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_W);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_S);
            }

            // Hacia la derecha
            if (commands[3].Equals(BOTON_A))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
            }
            // Hacia la izquierda
            else if (commands[4].Equals(BOTON_B))
            {
                WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
            }
            // Neutral
            else
            {
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
            }
        }
    }
}
