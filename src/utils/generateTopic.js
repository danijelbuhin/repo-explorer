// Popular topics taken from https://github.com/github/explore/tree/master/topics

export const popularTopics = ['3d', 'activitypub', 'ai', 'ajax', 'algolia', 'algorithm', 'amphp', 'android', 'angular', 'ansible', 'antlr', 'api', 'arduino', 'aspnet', 'atom', 'aurelia', 'auth0', 'awesome', 'aws', 'azure', 'babel', 'backbonejs', 'bash', 'basic8', 'bioinformatics', 'bitcoin', 'blockchain', 'bootstrap', 'bot', 'c', 'chrome-extension', 'chrome', 'cli', 'clojure', 'cms', 'code-quality', 'code-review', 'compiler', 'composer', 'computer-vision', 'conan', 'contentful', 'continuous-integration', 'cpp', 'cryptocurrency', 'crystal', 'csharp', 'css', 'cwl', 'd', 'dart', 'data-structures', 'data-visualization', 'database', 'deep-learning', 'dependency-management', 'deployment', 'discord', 'django', 'docker', 'documentation', 'dotnet', 'duckduckgo', 'electron', 'elixir', 'emacs', 'ember', 'emoji', 'emulator', 'es6', 'eslint', 'ethereum', 'express', 'f-droid', 'fantasy-console', 'firebase', 'firefox-extension', 'firefox', 'first-tech-challenge', 'fish', 'flask', 'flutter', 'font', 'framework', 'frontend', 'game-engine', 'game-off', 'gamemaker', 'git', 'github-api', 'global-game-jam', 'go', 'godot', 'google-cloud', 'google', 'gradle', 'graphql', 'gulp', 'hacktoberfest', 'haskell', 'haxe', 'homebrew', 'homebridge', 'html', 'http', 'icon-font', 'image-processing', 'indieweb', 'ios', 'ipfs', 'java', 'javascript', 'jekyll', 'jquery', 'js13kgames', 'json', 'julia', 'jupyter-notebook', 'kerbal-space-program', 'koa', 'kotlin', 'kubernetes', 'laravel', 'latex', 'less', 'library', 'liko-12', 'lineageos', 'linux', 'lisp', 'localization', 'lua', 'ludum-dare', 'luvit', 'machine-learning', 'macos', 'mahapps', 'markdown', 'mastodon', 'material-design', 'matlab', 'maven', 'microformats', 'minecraft', 'mobile', 'monero', 'mongodb', 'mongoose', 'monitoring', 'mvvmcross', 'mysql', 'nativescript', 'neo', 'neural-network', 'nim', 'nlp', 'nodejs', 'nosql', 'npm', 'objective-c', 'ocaml', 'open-access', 'opencv', 'openfin', 'opengl', 'operating-system', 'p2p', 'package-manager', 'parsing', 'perl', 'perl6', 'pharo', 'phaser', 'php', 'phpunit', 'pico-8', 'pixel-art', 'pixel-vision-8', 'postgresql', 'privacy', 'probot', 'project-management', 'publishing', 'pwa', 'python', 'qt', 'r', 'racket', 'rails', 'raspberry-pi', 'ratchet', 'react-native', 'react', 'reactiveui', 'reactphp', 'redux', 'reflex-frp', 'rest-api', 'ruby', 'rust', 'sass', 'scala', 'scikit-learn', 'sdn', 'security', 'server', 'serverless', 'shell', 'sitecore', 'sketch', 'spacevim', 'spring-boot', 'sql', 'storybook', 'styled-components', 'sublime-text', 'support', 'swift', 'symfony', 'tailwind', 'tbox', 'telegram', 'tensorflow', 'terminal', 'terraform', 'testing', 'thelounge', 'threejs', 'tic-80', 'twitter', 'typescript', 'ubuntu', 'unity', 'unreal-engine', 'uportal', 'userscript', 'vagrant', 'vim', 'virtual-reality', 'visual-studio-code', 'vue', 'wagtail', 'web-assembly', 'web-components', 'webapp', 'webextension', 'webpack', 'windows', 'wordplate', 'wordpress', 'xamarin', 'xcode', 'xmake', 'xml', 'yii', 'zeit', 'zeplin', 'zsh'];

export default function generateTopic({
  topics,
  language,
  description,
  name,
}) {
  if (language) {
    return language;
  }
  if (topics.length > 0 && !language) {
    return topics[0];
  }
  if (topics.length === 0) {
    for (let i = 0; i < popularTopics.length; i += 1) {
      const topic = popularTopics[i];
      if (name.includes(topic) || description.includes(topic)) {
        return topic;
      }
    }
  }
  return null;
}
