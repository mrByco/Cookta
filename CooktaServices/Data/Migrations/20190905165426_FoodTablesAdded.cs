using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CooktaServices.Data.Migrations
{
    public partial class FoodTablesAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IngredientTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Units", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UnitId = table.Column<Guid>(nullable: true),
                    TypeId = table.Column<Guid>(nullable: true),
                    Value = table.Column<float>(nullable: false),
                    FoodId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ingredients_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ingredients_IngredientTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "IngredientTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ingredients_Units_UnitId",
                        column: x => x.UnitId,
                        principalTable: "Units",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_FoodId",
                table: "Ingredients",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_TypeId",
                table: "Ingredients",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_UnitId",
                table: "Ingredients",
                column: "UnitId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropTable(
                name: "IngredientTypes");

            migrationBuilder.DropTable(
                name: "Units");
        }
    }
}
