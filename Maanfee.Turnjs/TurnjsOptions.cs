namespace Maanfee.Turnjs
{
    public class TurnjsOptions
    {
        public float Width { get; set; } = 0;
        public float Height { get; set; } = 0;
        public bool AutoCenter { get; set; } = true;
        public int Duration { get; set; } = 1000;
        public bool Acceleration { get; set; } = true;
        public string Display { get; set; } = "double";
        public TurnjsDirection Direction { get; set; } = TurnjsDirection.LTR;
    }
}
