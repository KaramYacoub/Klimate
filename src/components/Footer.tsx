export default function Footer() {
  return (
    <footer className="border-t backdrop-blur-2xl py-12 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 text-center text-gray-400">
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/karam-yacoub-65857a284/"
          target="_blank"
          className="font-semibold underline underline-offset-4 hover:text-foreground transition-colors duration-200"
        >
          Karam Yacoub
        </a>
      </div>
    </footer>
  );
}
