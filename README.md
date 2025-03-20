# Resistance Reno AI

Resistance Reno AI is a legal and policy analysis tool that leverages OpenAI's GPT-4.5 model to analyze U.S. executive orders. The tool provides structured evaluations based on progressive values, focusing on free access to healthcare, education, affordable childcare, and housing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributions)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/brienjl/resistance-reno-ai.git
    cd resistance-reno-ai
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

## Usage

To start the analysis, run the following command with the URL of the executive order you want to analyze:
```sh
node index.js https://www.whitehouse.gov/presidential-actions/...

```

The script will:

1. Fetch the executive order text from the provided URL.
2. Analyze the text using OpenAI's GPT-4.5 model.
3. Save the analysis to a Markdown file in the executive_order_analysis directory.
4. Commit and push the analysis to the GitHub repository.

## Project Structure

```
resistance-reno-ai/
├── .env -- Store your API Key here
├── .gitignore
├── index.js -- Main entry point for the script
├── EO-analysis/
├── executive_order_analysis/
│   ├── markdownFilesSaveHere.md
│   ├── ...
├── models/
│   ├── openai.js  -- Contains functions to interact with the OpenAI API
│   ├── scraper.js -- Contains functions to scrape executive order text from the White House website.
├── utils/
│   ├── gitHandler.js -- Contains functions to commit and push changes to GitHub.
│   ├── markdownHandler.js -- Contains functions to save analysis results to Markdown files.

```

## Contributions
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.