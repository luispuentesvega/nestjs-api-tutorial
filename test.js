process.stdout.write('Hello \n\n');

const questions = [
  'what is your name?',
  'wjat are you doing?',
  'what is your?',
];

const answers = [];

function ask(i) {
  process.stdout.write(`\n\n ${questions[i]}`);
  process.stdout.write(` > `);
}

process.stdin.on('data', function (data) {
  answers.push(data.toString().trim());

  if (answers.length < questions.length) {
    ask(answers.length);
  } else {
    process.exit();
  }
});

ask(answers.length);

process.on('exit', function () {
  process.stdout.write('\n\n\n');
});
