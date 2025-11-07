// ref from pxt_modules/libs/game/prompt.ts
namespace game.prompt {
const font = image.font8; // FONT8-TODO

const PADDING = 4;
const NUM_LETTERS = 26;

const ALPHABET_ROW_LENGTH = 12;

const NUM_ROWS = Math.ceil(NUM_LETTERS / ALPHABET_ROW_LENGTH);
const INPUT_ROWS = 2;

const CONTENT_WIDTH = screen.width - PADDING * 2;
const CONTENT_HEIGHT = screen.height - PADDING * 2;
const CONTENT_TOP = PADDING;

// Dimensions of a "cell"
const CELL_WIDTH = Math.floor(CONTENT_WIDTH / ALPHABET_ROW_LENGTH);
const CELL_HEIGHT = CELL_WIDTH;
const LETTER_OFFSET_X = Math.floor((CELL_WIDTH - font.charWidth) / 2);
const LETTER_OFFSET_Y = Math.floor((CELL_HEIGHT - font.charHeight) / 2);
const BLANK_PADDING = 1;
const ROW_LEFT = PADDING + Math.floor((CONTENT_WIDTH - (CELL_WIDTH * ALPHABET_ROW_LENGTH)) / 2);
const BOTTOM_BAR_HEIGHT = PADDING + 4 + CELL_HEIGHT;

// Dimensions of the alphabet area
const ALPHABET_HEIGHT = NUM_ROWS * CELL_HEIGHT;
const ALPHABET_TOP = CONTENT_TOP + CONTENT_HEIGHT - ALPHABET_HEIGHT - BOTTOM_BAR_HEIGHT;
const ALPHABET_INPUT_MARGIN = 10;

// Dimensions of area where text is input
const INPUT_HEIGHT = INPUT_ROWS * CELL_HEIGHT;
const INPUT_TOP = ALPHABET_TOP - INPUT_HEIGHT - ALPHABET_INPUT_MARGIN;

class Prompt extends game.Prompt {
    constructor(promptTheme?: game.PromptTheme) {
        super();
        this.theme = promptTheme
    }

    protected drawInputArea() {
        const answerLeft = ROW_LEFT + Math.floor(
            ((CELL_WIDTH * ALPHABET_ROW_LENGTH) -
                CELL_WIDTH * Math.min(this.answerLength, ALPHABET_ROW_LENGTH)) / 2);

        for (let i = 0; i < this.answerLength; i++) {
            const col = i % ALPHABET_ROW_LENGTH;
            const row = Math.floor(i / ALPHABET_ROW_LENGTH);
            if (this.selectionStart !== this.selectionEnd && i >= this.selectionStart && i < this.selectionEnd) {
                screen.fillRect(
                    answerLeft + col * CELL_WIDTH,
                    INPUT_TOP + row * CELL_HEIGHT * 2,
                    CELL_WIDTH,
                    INPUT_TOP + row * CELL_HEIGHT + CELL_HEIGHT * 4 - 1,
                    this.theme.colorCursor
                ); 
            }
   
            screen.fillRect(
                answerLeft + col * CELL_WIDTH + BLANK_PADDING,
                INPUT_TOP + row * CELL_HEIGHT + CELL_HEIGHT * 7 - 1,
                CELL_WIDTH - BLANK_PADDING,
                1,
                !this.useSystemKeyboard && !this.blink() && i === this.selectionStart ? this.theme.colorInputHighlighted : this.theme.colorInput
            );

            if (i < this.result.length) {
                const char = this.result.charAt(i);
                screen.print(
                    char,
                    answerLeft + col * CELL_WIDTH + LETTER_OFFSET_X,
                    INPUT_TOP + row * CELL_HEIGHT + CELL_HEIGHT * 7 - 8,
                    this.theme.colorInputText,
                    font 
                );
            }
        }
  
        // draw the blinking text cursor
        if (this.useSystemKeyboard) {
            if (this.selectionStart === this.selectionEnd && this.selectionStart < this.answerLength) {
                const col = this.selectionStart % ALPHABET_ROW_LENGTH;
                const row = Math.floor(this.selectionStart / ALPHABET_ROW_LENGTH);
                if (!this.blink()) {
                    screen.fillRect(
                        answerLeft + col * CELL_WIDTH,
                        INPUT_TOP + row * CELL_HEIGHT + CELL_HEIGHT * 6,
                        1,
                        CELL_HEIGHT,
                        this.theme.colorCursor
                    );
                }
            }
        }
    }
    
    protected createRenderable() {
        if (this.renderable) {
            this.renderable.destroy();
        }

        const promptText = new sprites.RenderText(this.message, CONTENT_WIDTH);
    
        this.renderable = scene.createRenderable(-1, () => {
            this.drawInputArea();
        });
    }
 }

 //% blockId="game_prompt_chat"
 //% block="chat with AI %message %answerLength || %theme=__getPromptTheme()" weight=100
 //% answerLength.defl=12
    export function chat(message: string, answerLength: number, theme?: PromptTheme) {
   const prompt = new Prompt(theme)
   return prompt.show(message, answerLength)
    }

   //% blockId="game_prompt__getPromptTheme"
   //% block="get prompt theme %col1 %col2 %col3 %col4 %col5 %col6 %col7 %col8 %col9" %
   //% col1.defl=1 
   //% col2.defl=3 
   //% col3.defl=5
   //% col4.defl=1
   //% col5.defl=1
   //% col6.defl=7
   //% col7.defl=15 
   //% col8.defl=3
   //% col9.defl=1
   //% weight=99
 export function __getPromptTheme(col1 = 1, col2 = 3, col3 = 5, col4 = 1, col5  = 1, col6 = 7, col7 = 15, col8 = 3, col9 = 1): PromptTheme {
     /**        default colors
      *         colorPrompt: 1,
                colorInput: 3,
                colorInputHighlighted: 5,
                colorInputText: 1,
                colorAlphabet: 1,
                colorCursor: 7,
                colorBackground: 15,
                colorBottomBackground: 3,
                colorBottomText: 1,
     */

  return {
      colorPrompt: col1,
      colorInput: col2,
      colorInputHighlighted: col3,
      colorInputText: col4,
      colorAlphabet: col5,
      colorCursor: col6,
      colorBackground: col7,
      colorBottomBackground: col8,
      colorBottomText: col9
  }
 }
}
