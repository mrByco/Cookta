using Cooktapi.Food;
using Cooktapi.Measuring;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.UI
{
    public delegate void IngredientAddedEventHandler(Ingredient added);
    public class IngredientAdderFlyout : StackPanel
    {
        public event IngredientAddedEventHandler OnIngredeintAdded;

        public readonly AutoSuggestBox IngredientSuggestionTextBox;
        public readonly TextBox TextBox;
        public readonly ComboBox ComboBox;
        public readonly Button AddButton;

        public IngredientAdderFlyout() : base()
        {
            base.Orientation = Orientation.Horizontal;

            IngredientSuggestionTextBox = new AutoSuggestBox();
            IngredientSuggestionTextBox.Width = 250;
            IngredientSuggestionTextBox.ItemsSource = m_AvailableTypes;
            IngredientSuggestionTextBox.QuerySubmitted += autoSuggestBox_QuerySubmitted;
            IngredientSuggestionTextBox.TextChanged += autoSuggestBox_TextChanged;
            base.Children.Add(IngredientSuggestionTextBox);

            TextBox = new TextBox();
            TextBox.PlaceholderText = "pl.: 5";
            TextBox.TextChanged += valueTextBox_TextChanged;
            base.Children.Add(TextBox);

            ComboBox = new ComboBox();
            IngredientSuggestionTextBox.Width = 150;
            ComboBox.PlaceholderText = "Egység";
            ComboBox.ItemsSource = m_AvailableUnits;
            ComboBox.SelectionChanged += unitComboBox_SelectionChanged;
            base.Children.Add(ComboBox);

            AddButton = new Button();
            AddButton.IsEnabled = false;
            AddButton.Content = "Hozzáadás";
            AddButton.Click += AddBTN_Click;
            base.Children.Add(AddButton);

        }

        private IngredientType adderType { get; set; }
        private double? adderValue { get; set; }
        private Unit adderUnit { get; set; }

        private readonly ObservableCollection<Unit> m_AvailableUnits = new ObservableCollection<Unit>();
        private readonly ObservableCollection<IngredientType> m_AvailableTypes = new ObservableCollection<IngredientType>();
        private async void SetAvailableTypes(List<IngredientType> types)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_AvailableTypes.Clear();
                foreach (IngredientType type in types)
                {
                    m_AvailableTypes.Add(type);
                }
            });
        }
        private async void SetAvailableUnits(List<Unit> units)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                m_AvailableUnits.Clear();
                foreach (Unit unit in units)
                {
                    m_AvailableUnits.Add(unit);
                }
            });
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
            UpdateAdderButtonEnabled();
        }
        private void UpdateAdderButtonEnabled()
        {
            AddButton.IsEnabled = adderType != null && adderValue != null && adderUnit != null;
        }

        private void unitComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateAdderButtonEnabled();
        }

        private void autoSuggestBox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            var types = IngredientType.Search(8, args.QueryText);
            IngredientType type = types.Find((ingType) => { return ingType.Name == args.QueryText; });
            if (type != null)
            {
                ChooseIngredientType(type);
            }
            else
            {
                sender.Text = "";
            }
        }
        private void AddBTN_Click(object sender, RoutedEventArgs e)
        {
            OnIngredeintAdded?.Invoke(new Ingredient(adderType, (double)adderValue, adderUnit, new List<Food>()));
            adderType = null;
            IngredientSuggestionTextBox.Text = "";
            adderUnit = null;
            adderValue = null;
            TextBox.Text = "";
        }


        private void ChooseIngredientType(IngredientType IngType)
        {
            adderType = IngType;
            SetAvailableUnits(IngType.GetUnits());
            if (!m_AvailableUnits.Contains(adderUnit))
            {
                adderUnit = null;
            }
            UpdateAdderButtonEnabled();
        }

        private void autoSuggestBox_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {
            var result = IngredientType.Search(8, sender.Text);
            sender.ItemsSource = result;
            if (result.Find((i) => { return i.Name.ToLower() == sender.Text.ToLower(); }) != null)
            {
                ChooseIngredientType(result.Find((i) => { return i.Name.ToLower() == sender.Text.ToLower(); }));
            }
        }
    }
}
