using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Documents;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class CommandTextBlock : UserControl
    {
        public CommandTextBlock()
        {
            this.InitializeComponent();
        }

        public event VoidDelegate BeforeExecuteCommand;

        private string m_Text;
        public string Text
        {
            get => m_Text;
            set
            {
                m_Text = value;
                var inlines = ParseText(value);
                TextBlock.Inlines.Clear();
                inlines.ForEach(inline => { TextBlock.Inlines.Add(inline); });
            }
        }
        //Examlple text: Some text before command <OPENFOOD,Csirke,af5d4d521d> some text after the command

        public List<Inline> ParseText(string input)
        {
            string text = input;
            var inlineList = new List<Inline>();
            bool isCommand = text[0] == '<';

            char triggerChar;
            string str = "";
            //parse all the runs
            while (text.Length > 0)
            {
                str = "";
                triggerChar = isCommand ? '>' : '<';
                //Create one run
                while (text.Length > 0 && text[0] != triggerChar)
                {
                    str += text[0];
                    text = text.Remove(0, 1);
                }
                if (isCommand)
                {
                    var inline = ParseCommand(str);
                    inlineList.Add(inline);
                }
                else
                {
                    Run run = new Run();
                    run.Text = str;
                    inlineList.Add(run);
                }
                //remove the < or  > character to next run starts with clean sheets
                if (text.Length > 0)
                {
                    isCommand = text[0] == '<';
                    text = text.Remove(0, 1);
                }

            }
            return inlineList;
        }
        public Inline ParseCommand(string command)
        {
            var strings = command.Split(',');
            Inline inline;
            switch (strings[0])
            {
                case "OPENFOODLINK":
                    if (strings.Length != 3) throw new Exception("Invalid command args: " + command);
                    inline = new Hyperlink();
                    ((Hyperlink)inline).Inlines.Add(new Run() { Text = strings[1] });
                    ((Hyperlink)inline).Click += (sender, args) => {
                        BeforeExecuteCommand?.Invoke();
                        MainPage.NavigateTo("fooddetail", null, strings[2]); };
                    break;
                default:
                    throw new Exception("Invalid command: " + command);
            }
            return inline;
        }
    }
}
