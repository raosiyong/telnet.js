var ESC = new Buffer([27]);

var SE = 240,
NOP = 241,
DM = 242,
BRK = 243,
IP = 244,
AO = 245,
AYT = 246,
EC = 247,
EL = 248,
GA = 249,
SB = 250,
WILL = 251,
WONT = 252,
DO = 253,
DONT = 254,
IAC = 255;

var transmitBinary = 0,
echo = 1,
suppressGoAhead = 3,
status = 5,
timingMark = 6,
terminalType = 24,
windowSize = 31,
terminalSpeed = 32,
remoteFlowControl = 33,
linemode = 34,
environmentVariables = 36;

exports.enableEcho = function() {
    return new Buffer([IAC, WILL, echo, IAC, WILL, suppressGoAhead]);
};

// TODO: Sort out ---------------------------------------------------
var cmd = {
    // Set new line mode						
    LMN: '[20h',
    // Set cursor key to application			
    DECCKM: '[?1h',
    // Set ANSI (versus VT52)					
    DECANM: 'e',
    // Set number of columns to 132			
    DECCOLM: '[?3h',
    // Set smooth scrolling					
    DECSCLM: '[?4h',
    // Set reverse video on screen			
    DECSCNM: '[?5h',
    // Set origin to relative					
    DECOM: '[?6h',
    // Set auto-wrap mode						
    DECAWM: '[?7h',
    // Set auto-repeat mode					
    DECARM: '[?8h',
    // Set interlacing mode					
    DECINLM: '[?9h',
    // Set line feed mode						
    LMN2: '[20l',
    // Set cursor key to cursor				
    DECCKM2: '[?1l',
    // Set VT52 (versus ANSI)					
    DECANM2: '[?2l',
    // Set number of columns to 80			
    DECCOLM2: '[?3l',
    // Set jump scrolling						
    DECSCLM2: '[?4l',
    // Set normal video on screen				
    DECSCNM2: '[?5l',
    // Set origin to absolute					
    DECOM2: '[?6l',
    // Reset auto-wrap mode					
    DECAWM2: '[?7l',
    // Reset auto-repeat mode					
    DECARM2: '[?8l',
    // Reset interlacing mode					
    DECINLM2: '[?9l',
    // Set alternate keypad mode				
    DECKPAM: '=',
    // Set numeric keypad mode				
    DECKPNM: '>',
    // Set United Kingdom G0 character set	
    setukg0: '(A',
    // Set United Kingdom G1 character set	
    setukg1: ')A',
    // Set United States G0 character set		
    setusg0: '(B',
    // Set United States G1 character set		
    setusg1: ')B',
    // Set G0 special chars. & line set	
    setspecg0: '(0',
    // Set G1 special chars. & line set	
    setspecg1: ')0',
    // Set G0 alternate character ROM			
    setaltg0: '(1',
    // Set G1 alternate character ROM			
    setaltg1: ')1',
    // Set G0 alt char ROM and spec. graphics	
    setaltspecg0: '(2',
    // Set G1 alt char ROM and spec. graphics	
    setaltspecg1: ')2',
    // Set single shift 2						
    SS2: 'N',
    // Set single shift 3						
    SS3: 'O',
    // Turn off character attributes			
    SGR0: '[m',
    // Turn off character attributes			
    SGR02: '[0m',
    // Turn bold mode on						
    SGR1: '[1m',
    // Turn low intensity mode on				
    SGR2: '[2m',
    // Turn underline mode on					
    SGR4: '[4m',
    // Turn blinking mode on					
    SGR5: '[5m',
    // Turn reverse video on					
    SGR7: '[7m',
    // Turn invisible text mode on			
    SGR8: '[8m',
    // Set top and bottom lines of a window	
    DECSTBM: '[Line;Liner',
    // Move cursor up n lines				
    CUU: '[ValueA',
    // Move cursor down n lines			
    CUD: '[ValueB',
    // Move cursor right n lines			
    CUF: '[ValueC',
    // Move cursor left n lines			
    CUB: '[ValueD',
    // Move cursor to upper left corner		
    cursorhome: '[H',
    // Move cursor to upper left corner		
    cursorhome2: '[;H',
    // Move cursor to screen location v,h	
    CUP: '[Line;ColumnH',
    // Move cursor to upper left corner		
    hvhome: '[f',
    // Move cursor to upper left corner		
    hvhome2: '[;f',
    // Move cursor to screen location v,h	
    CUP2: '[Line;Columnf',
    // Move/scroll window up one line			
    IND: 'D',
    // Move/scroll window down one line		
    RI: 'M',
    // Move to next line						
    NEL: 'E',
    // Save cursor position and attributes	
    DECSC: '7',
    // Restore cursor position and attributes	
    DECSC2: '8',
    // Set a tab at the current column		
    HTS: 'H',
    // Clear a tab at the current column		
    TBC: '[g',
    // Clear a tab at the current column		
    TBC2: '[0g',
    // Clear all tabs							
    TBC3: '[3g',
    // Double-height letters, top half		
    DECDHL: '#3',
    // Double-height letters, bottom half		
    DECDHL2: '#4',
    // Single width, single height letters	
    DECSWL: '#5',
    // Double width, single height letters	
    DECDWL2: '#6',
    // Clear line from cursor right			
    EL0: '[K',
    // Clear line from cursor right			
    EL02: '[0K',
    // Clear line from cursor left			
    EL1: '[1K',
    // Clear entire line						
    EL2: '[2K',
    // Clear screen from cursor down			
    ED0: '[J',
    // Clear screen from cursor down			
    ED02: '[0J',
    // Clear screen from cursor up			
    ED1: '[1J',
    // Clear entire screen					
    ED2: '[2J',
    // Device status report					
    DSR: '5n',
    // Response: terminal is OK				
    DSR2: '0n',
    // Response: terminal is not OK			
    DSR3: '3n',
    // Get cursor position					
    DSR4: '6n',
    // Response: cursor is at v,h	
    CPR: 'Line;ColumnR',
    // Identify what terminal type			
    DA: '[c',
    // Identify what terminal type (another)	
    DA2: '[0c',
    // Response: terminal type code n		
    DA3: '[?1;Value0c',
    // Reset terminal to initial state		
    RIS: 'c',
    // Screen alignment display				
    DECALN: '#8',
    // Confidence power up test				
    DECTST: '[2;1y',
    // Confidence loopback test				
    DECTST2: '[2;2y',
    // Repeat power up test					
    DECTST3: '[2;9y',
    // Repeat loopback test					
    DECTST4: '[2;10y',
    // Turn off all four leds					
    DECLL0: '[0q',
    // Turn on LED #1							
    DECLL1: '[1q',
    // Turn on LED #2							
    DECLL2: '[2q',
    // Turn on LED #3							
    DECLL3: '[3q',
    // Turn on LED #4							
    DECLL4: '[4q',
    // Enter/exit ANSI mode (VT52)			
    setansi: '<',
    // Enter alternate keypad mode			
    altkeypad: '=',
    // Exit alternate keypad mode				
    numkeypad: '>',
    // Use special graphics character set		
    setgr: 'F',
    // Use normal US/UK character set			
    resetgr: 'G',
    // Move cursor up one line				
    cursorup: 'A',
    // Move cursor down one line				
    cursordn: 'B',
    // Move cursor right one char				
    cursorrt: 'C',
    // Move cursor left one char				
    cursorlf: 'D',
    // Move cursor to upper left corner		
    cursorhome3: 'H',
    // Generate a reverse line-feed			
    revindex: 'I',
    // Erase to end of current line			
    cleareol: 'K',
    // Erase to end of screen					
    cleareos: 'J',
    // Identify what the terminal is			
    ident: 'Z',
    // Correct response to ident				
    identresp: '/Z'
};

exports.chain = exports.c = function() {
    return (function() {
        var self = this,
        buffer = self.buffer = '';

        Object.keys(cmd).forEach(function(key) {
            self[key] = function(column, line) {
                buffer += ESC + cmd[key].replace('Column', column).replace('Line', line);
                return self;
            };
        });

        self.append = self.a = function(msg) {
            buffer += msg;
            return self;
        };

        self.up = function() {
            buffer += ESC + '[nA';
            return self;
        };

        self.down = function() {
            buffer += ESC + '[nB';
            return self;
        };

        self.right = function() {
            buffer += ESC + '[nC';
            return self;
        };

        self.left = function() {
            buffer += ESC + '[nD';
            return self;
        };

        self.move = function(x, y) {
            buffer += ESC + '[' + y + ';' + x + 'H';
            return self;
        };

        self.save = function() {
            buffer += ESC + '7';
            return self;
        };

        self.restore = function() {
            buffer += ESC + '8';
            return self;
        };

        self.clearLine = function() {
            buffer += ESC + '[2K';
            return self;
        };

        self.clear = function() {
            buffer += ESC + '[2J';
            return self;
        };

        self.normal = function() {
            buffer += ESC + '[0m';
            return self;
        };

        self.bold = function() {
            buffer += ESC + '[1m';
            return self;
        };

        self.underline = function() {
            buffer += ESC + '[4m';
            return self;
        };

        self.blink = function() {
            buffer += ESC + '[5m';
            return self;
        };

        self.video = function() {
            buffer += ESC + '[7m';
            return self;
        };

        self.height = function(i) {
            buffer += ESC + '#' + (i + 3);
            return self;
        };

        self.wide = function() {
            buffer += ESC + '[?3l';
            return self;
        };

        self.send = self.s = self.write = self.w = function(socket) {
            socket.write(buffer);
            return self;
        };

        return self;
    } ());
};

