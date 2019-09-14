using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CooktaServices.Data.Migrations
{
    public partial class UnitsDetailed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "IngredientTypeId",
                table: "Units",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ToBase",
                table: "Units",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Units",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "CountEnabled",
                table: "IngredientTypes",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "MassEnabled",
                table: "IngredientTypes",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "VolumeEnabled",
                table: "IngredientTypes",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Units_IngredientTypeId",
                table: "Units",
                column: "IngredientTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Units_IngredientTypes_IngredientTypeId",
                table: "Units",
                column: "IngredientTypeId",
                principalTable: "IngredientTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Units_IngredientTypes_IngredientTypeId",
                table: "Units");

            migrationBuilder.DropIndex(
                name: "IX_Units_IngredientTypeId",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "IngredientTypeId",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "ToBase",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "CountEnabled",
                table: "IngredientTypes");

            migrationBuilder.DropColumn(
                name: "MassEnabled",
                table: "IngredientTypes");

            migrationBuilder.DropColumn(
                name: "VolumeEnabled",
                table: "IngredientTypes");
        }
    }
}
