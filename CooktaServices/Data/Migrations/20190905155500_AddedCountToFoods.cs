using Microsoft.EntityFrameworkCore.Migrations;

namespace CooktaServices.Data.Migrations
{
    public partial class AddedCountToFoods : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "Foods",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Count",
                table: "Foods");
        }
    }
}
