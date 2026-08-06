namespace loginsignuphome.models
{
    public class AddServiceRequest
    {
        public string? SalonId { get; set; }

        public string? ServiceName { get; set; }

        public int Duration { get; set; }

        public int Price { get; set; }
    }
}
