// Game canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;
canvas.height = 640;

// Game elements
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');

// Audio elements
const flapSound = document.getElementById('flap-sound');
const scoreSound = document.getElementById('score-sound');
const hitSound = document.getElementById('hit-sound');
const backgroundMusic = document.getElementById('background-music');

// Game variables
let bird;
let pipes = [];
let particles = [];
let stars = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameActive = false;
let gameSpeed = 2;
let gravity = 0.4; // Reduced gravity for better gameplay
let lastPipeTime = 0;
let pipeInterval = 1500; // milliseconds
let lastTime = 0;
let animationId;
let gameStarted = false; // Track if game has been started

// Bird object
class Bird {
    constructor() {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 30;
        this.velocity = 0;
        this.lift = -10;
        this.rotation = 0;
        this.colors = {
            body: '#00ffff',
            highlight: '#ffffff',
            shadow: '#0088ff'
        };
        this.trailTimer = 0;
        // Add initial flap to prevent immediate falling
        this.velocity = this.lift / 2;
    }

    update() {
        // Apply gravity
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Rotate based on velocity
        this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.velocity * 0.04));
        
        // Floor boundary
        if (this.y + this.height > canvas.height - 50) {
            this.y = canvas.height - this.height - 50;
            this.velocity = 0;
            if (gameActive) {
                gameOver();
            }
        }
        
        // Ceiling boundary
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
        
        // Create trail particles
        this.trailTimer++;
        if (this.trailTimer % 3 === 0 && gameActive) {
            particles.push(new Particle(
                this.x - 5,
                this.y + this.height / 2,
                Math.random() * 3 + 1,
                Math.random() * 3 + 1,
                '#00ffff',
                0.7
            ));
        }
    }

    flap() {
        this.velocity = this.lift;
        flapSound.currentTime = 0;
        flapSound.play();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Draw bird body (futuristic design)
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw highlight
        ctx.fillStyle = this.colors.highlight;
        ctx.beginPath();
        ctx.ellipse(-5, -5, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.width / 4, -this.height / 6, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw glowing effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2 + 2, this.height / 2 + 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    }
}

// Pipe object
class Pipe {
    constructor() {
        this.spacing = 150;
        this.top = Math.random() * (canvas.height - this.spacing - 200) + 50;
        this.bottom = this.top + this.spacing;
        this.x = canvas.width;
        this.width = 60;
        this.scored = false;
        this.color = '#00ffff';
        this.highlight = '#ffffff';
    }

    update() {
        this.x -= gameSpeed;
        
        // Check if bird passed the pipe
        if (!this.scored && bird.x > this.x + this.width) {
            score++;
            scoreDisplay.textContent = score;
            this.scored = true;
            scoreSound.currentTime = 0;
            scoreSound.play();
            
            // Create score particles
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle(
                    bird.x + bird.width,
                    bird.y,
                    Math.random() * 3 - 1.5,
                    Math.random() * 3 - 1.5,
                    '#ffff00',
                    1
                ));
            }
        }
        
        // Check collision with bird
        if (
            bird.x + bird.width > this.x && 
            bird.x < this.x + this.width && 
            (bird.y < this.top || bird.y + bird.height > this.bottom)
        ) {
            gameOver();
        }
    }

    draw() {
        // Futuristic pipe design
        // Top pipe
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        
        // Bottom pipe
        ctx.fillRect(this.x, this.bottom, this.width, canvas.height - this.bottom);
        
        // Pipe edges
        ctx.fillStyle = this.highlight;
        ctx.fillRect(this.x, this.top - 10, this.width, 10);
        ctx.fillRect(this.x, this.bottom, this.width, 10);
        
        // Glowing effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Top pipe outline
        ctx.strokeRect(this.x, 0, this.width, this.top);
        
        // Bottom pipe outline
        ctx.strokeRect(this.x, this.bottom, this.width, canvas.height - this.bottom);
        
        ctx.shadowBlur = 0;
        
        // Digital circuit pattern
        ctx.strokeStyle = '#003366';
        ctx.lineWidth = 1;
        
        for (let i = 5; i < this.width - 5; i += 10) {
            // Top pipe pattern
            ctx.beginPath();
            ctx.moveTo(this.x + i, 10);
            ctx.lineTo(this.x + i, this.top - 15);
            ctx.stroke();
            
            // Bottom pipe pattern
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.bottom + 15);
            ctx.lineTo(this.x + i, canvas.height - 10);
            ctx.stroke();
        }
    }
}

// Particle effects
class Particle {
    constructor(x, y, dx, dy, color, alpha) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.alpha = alpha;
        this.life = 30;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life--;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Background star
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.5 + 0.1;
        this.brightness = Math.random();
        this.color = `rgba(255, 255, 255, ${this.brightness})`;
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }
        
        // Twinkle effect
        this.brightness = 0.3 + Math.abs(Math.sin(Date.now() * 0.001 * this.speed) * 0.7);
        this.color = `rgba(255, 255, 255, ${this.brightness})`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create stars for background
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }
}

// Draw background
function drawBackground() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000066');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    // Draw ground
    ctx.fillStyle = '#003366';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Ground details
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();
    
    // Grid lines on ground
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 50);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
}

// Game loop
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update and draw bird
    bird.update();
    bird.draw();
    
    // Update and draw pipes
    pipes.forEach((pipe, index) => {
        pipe.update();
        pipe.draw();
        
        // Remove pipes that are off screen
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });
    
    // Create new pipes only after game has started
    if (gameActive && timestamp - lastPipeTime > pipeInterval) {
        pipes.push(new Pipe());
        lastPipeTime = timestamp;
    }
    
    // Update and draw particles
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        // Remove dead particles
        if (particle.life <= 0 || particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
    
    // Continue game loop if game is active
    if (gameActive) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start game
function startGame() {
    // Reset game state
    bird = new Bird();
    pipes = [];
    particles = [];
    score = 0;
    scoreDisplay.textContent = score;
    gameActive = true;
    gameStarted = true;
    lastPipeTime = performance.now(); // Set initial pipe time to current time
    
    // Hide start screen
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Start background music
    try {
        backgroundMusic.play().catch(e => console.log("Audio couldn't autoplay:", e));
    } catch (e) {
        console.log("Audio error:", e);
    }
    
    // Start game loop
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
    
    // Add initial flap to get the bird moving
    setTimeout(() => {
        if (gameActive) bird.flap();
    }, 100);
}

// Game over
function gameOver() {
    if (!gameActive) return; // Prevent multiple game over calls
    
    gameActive = false;
    
    try {
        hitSound.currentTime = 0;
        hitSound.play().catch(e => console.log("Audio couldn't play:", e));
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    } catch (e) {
        console.log("Audio error:", e);
    }
    
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(
            bird.x,
            bird.y,
            Math.random() * 6 - 3,
            Math.random() * 6 - 3,
            '#ff0000',
            1
        ));
    }
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    // Show game over screen after a short delay
    setTimeout(() => {
        finalScoreDisplay.textContent = score;
        highScoreDisplay.textContent = highScore;
        gameOverScreen.classList.remove('hidden');
    }, 1000);
    
    // Cancel animation frame
    cancelAnimationFrame(animationId);
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        if (!gameActive && gameStarted) {
            startGame();
        } else if (gameActive) {
            bird.flap();
        } else if (!gameActive && !gameStarted) {
            startGame();
        }
    }
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    if (gameActive) {
        bird.flap();
    } else if (!gameActive && gameStarted) {
        startGame();
    }
}, { passive: false });

// Initialize game
createStars();
highScoreDisplay.textContent = highScore;

// Create initial bird for display
bird = new Bird();
bird.velocity = 0; // No initial velocity for display bird

// Draw initial background
drawBackground();
bird.draw();
