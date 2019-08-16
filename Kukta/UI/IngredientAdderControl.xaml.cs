using Cooktapi.Food;
using Cooktapi.Measuring;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class IngredientAdderControl : UserControl
    {
        public IngredientAdderControl()
        {
            this.InitializeComponent();
        }
        public event IngredientAddedEventHandler OnIngredeintAdded;

        private IngredientType adderType { get; set; }
        private double? adderValue { get; set; }
        private Unit adderUnit
        {
            get
            {
                return UnitSelector.SelectedItem as Unit;
            }
            set
            {
                UnitSelector.SelectedItem = value;
            }
        }

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

        private void AddIngrdient(object sender, RoutedEventArgs e)
        {
            OnIngredeintAdded?.Invoke(new Ingredient(adderType, (double)adderValue, adderUnit, new List<IIngredientSource>()));
            adderType = null;
            IngredientSuggestionBox.Text = "";
            adderUnit = null;
            adderValue = null;
            ValueTextBox.Text = "";
        }
    }
}
