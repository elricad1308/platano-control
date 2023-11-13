using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetApp
{
    internal class Program
    {
        const string IZQUIERDA = "1";
        const string DERECHA = "2";

        static void Main(string[] args)
        {
            while (true)
            {
                string[] comandos = Console.ReadLine().Split(',');
                string movimiento = comandos[0];
                string salto = comandos[1];
                string accel = comandos[2];

                // MARIO WORLD
                if (movimiento.Equals(IZQUIERDA)) 
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
                }
                else if (movimiento.Equals(DERECHA))
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

                if (salto.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_Q);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
                } 

                /* MARIO KART
                if (movimiento.Equals(IZQUIERDA))
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);                    
                }
                else if (movimiento.Equals(DERECHA))
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                }

                if (accel.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_Q);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
                }

                if (accel.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
                }*/
            }
        }
    }
}
