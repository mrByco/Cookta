using Kukta.FoodFrameworkV2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Input;

namespace Kukta.UI
{
    public class IngredientList : StackPanel
    {
        private List<Ingredient> Ingredients;
        private bool EditMode;

        private IngredientType adderType;
        private double? adderValue;
        private Unit adderUnit;

        public IngredientList(bool editMode, List<Ingredient> ingredients)
        {
            Ingredients = ingredients;
            EditMode = editMode;
            UpdateLayout();
        }

        public async void UpdateLayout()
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                base.Children.Clear();

                if (Ingredients != null)
                {

                    //Title
                    TextBlock titleTextBlock = new TextBlock()
                    {
                        Text = "Hozzávalók",
                        HorizontalAlignment = HorizontalAlignment.Center,
                        HorizontalTextAlignment = TextAlignment.Center,
                        FontSize = 26,
                        Margin = new Thickness(5, 5, 5, 20),
                    };
                    base.Children.Add(titleTextBlock);
                    //Add ingredients
                    foreach (Ingredient ing in Ingredients)
                    {
                        Grid grid = new Grid();
                        grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Auto) });

                        TextBlock tb = new TextBlock()
                        {
                            Text = String.Format("- {0} {1} {2}.", ing.Value, ing.UnitName, ing.Type.Name),
                            VerticalAlignment = VerticalAlignment.Center,
                        };
                        Grid.SetColumn(tb, 0);
                        grid.Children.Add(tb);

                        if (EditMode)
                        {
                            grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) });

                            Button removeBTN = new Button()
                            {
                                Content = "-",
                                Margin = new Thickness(2, 4, 2, 4),
                            };
                            Grid.SetColumn(removeBTN, 1);
                            removeBTN.Click += removeBTNClick;
                            removeBTN.Tag = ing;
                            grid.Children.Add(removeBTN);
                        }
                        base.Children.Add(grid);
                    }

                    if (EditMode)
                    {
                        //Add ingredient adder
                        Grid addGrid = new Grid();
                        addGrid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(4, GridUnitType.Star) }); //auto suggest
                        addGrid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) }); //value
                        addGrid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) }); //unit
                        addGrid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) }); //add btn
                        AutoSuggestBox autoSuggestBox = new AutoSuggestBox()
                        {
                            PlaceholderText = "Hozzávaló",
                        };
                        TextBox valueTextBox = new TextBox()
                        {
                            PlaceholderText = "Mennyiség",
                        };
                        Grid.SetColumn(valueTextBox, 1);
                        ComboBox unitComboBox = new ComboBox()
                        {
                            PlaceholderText = "Mértékegység",
                            ItemsSource = Unit.GetUnits(),
                        };
                        Grid.SetColumn(unitComboBox, 2);
                        Button addButton = new Button
                        {
                            Content = "Hozzáadás",
                        };
                        addButton.IsEnabled = adderType != null && adderUnit != null && adderValue != null && adderValue > 0;
                        Grid.SetColumn(addButton, 3);
                        if (adderType != null)
                        {
                            autoSuggestBox.Text = adderType.ToString();
                            if (adderValue != null)
                            {
                                valueTextBox.Text = adderValue.ToString();
                            }
                            if (adderUnit != null && unitComboBox.SelectedValue != adderUnit)
                            {
                                unitComboBox.SelectedValue = adderUnit;
                            }
                            else
                            {
                                unitComboBox.ItemsSource = adderType.GetUnits();
                            }
                        }
                        autoSuggestBox.TextChanged += autoSuggestBox_TextChanged;
                        autoSuggestBox.SuggestionChosen += autoSuggestBox_SuggestionChosen;
                        autoSuggestBox.QuerySubmitted += autoSuggestBox_QuerySubmitted;
                        valueTextBox.TextChanged += valueTextBox_TextChanged;
                        unitComboBox.SelectionChanged += unitComboBox_SelectionChanged;
                        addButton.Click += AddIngrdient;

                        addGrid.Children.Add(autoSuggestBox);
                        addGrid.Children.Add(valueTextBox);
                        addGrid.Children.Add(unitComboBox);
                        addGrid.Children.Add(addButton);

                        base.Children.Add(addGrid);
                    }
                }
            });
        }

        internal List<Ingredient> GetIngredients()
        {
            return Ingredients;
        }

        private void AddIngrdient(object sender, RoutedEventArgs e)
        {
            Ingredients.Add(new Ingredient(adderType, (double)adderValue, adderUnit.Name));
            adderType = null;
            adderUnit = null;
            adderValue = null;
            UpdateLayout();
        }

        private void valueTextBox_TextChanged(object sender, TextChangedEventArgs args)
        {
            TextBox textBox = sender as TextBox;
            try
            {
                if (textBox.Text == "")
                {
                    adderValue = null;
                    return;
                }
                string s = textBox.Text.Replace('.', ',');
                if (s.StartsWith(','))
                    s = "0" + s;
                if (s.EndsWith(','))
                {
                    s = s + "0";
                }
                double newValue = Double.Parse(s);
                adderValue = newValue;
            }
            catch (FormatException e)
            {
                textBox.Text = adderValue.ToString();
            }
        }

        private void unitComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            adderUnit = (Unit)e.AddedItems.First();
            UpdateLayout();
        }

        private void autoSuggestBox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            IngredientType type = IngredientType.Search(1, args.QueryText).First();
            ChooseIngredientType(type);
        }

        private void autoSuggestBox_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
        {
            ChooseIngredientType(args.SelectedItem as IngredientType);
        }

        private void ChooseIngredientType(IngredientType IngType)
        {
            adderType = IngType;
            adderUnit = null;
            adderValue = null;
            UpdateLayout();
        }

        private void autoSuggestBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {
            var result = IngredientType.Search(8, sender.Text);
            sender.ItemsSource = result;
        }

        private void removeBTNClick(object sender, RoutedEventArgs e)
        {
            Button button = sender as Button;
            Ingredients.Remove((Ingredient)button.Tag);
            UpdateLayout();
        }
    }
}
