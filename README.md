# InputGPT

InputGPT is a chrome extension to help you fill out forms faster. It uses a GPT models to generate text for your inputs.

## Installation

This extension is not yet available on the chrome web store. To install it, you need to clone this repository and load it as an unpacked extension.

First, clone the repository:

```bash
git clone https://github.com/cgeosoft/inputgpt
```

Then, open chrome and go to `chrome://extensions`. Enable developer mode and click on "Load unpacked". Select the `inputgpt` folder.

## Usage

Once installed, you have to setup your OpenAI secret key. Click on the extension icon and enter your key. You can get a key [here](https://platform.openai.com/account/api-keys).

Keys are stored locally and are not sent to any server. This is also the case for the prompts you enter and the generated text.

Once you have entered your key, you can start using the extension. To generate text for an input,

1. focus on input
2. prefix your prompt with `!gpt`
3. press alt+enter

For example, if you want to generate a random username for a form, you can type `!gpt generate a random username` and the extension will generate a username for you and will fill the input with it.

An info box about the generated text will appear on the bottom-right corner of the page. This will include

1. **Model**: the model used to generate the text
2. **Tokens**: the number of tokens used to generate the text
3. **Cost**: the cost of the request based on the number of tokens used and the current pricing of OpenAI
4. **Time**: the time it took to generate the text in milliseconds

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [OpenAI](https://openai.com/) for the amazing GPT models
- Icons made by [Freepik](https://www.freepik.com/) from [www.flaticon.com](https://www.flaticon.com/free-icons/artificial-intelligence)