export class TextScramble {
  private el: HTMLElement;
  private originalText: string;
  private chars: string;
  private frameRequest: number | null = null;
  private frame: number = 0;
  private resolve: (() => void) | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.originalText = el.textContent || "";
    this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  }

  scramble(newText?: string): Promise<void> {
    const target = newText || this.originalText;
    const length = Math.max(this.el.textContent?.length || 0, target.length);

    return new Promise((resolve) => {
      this.resolve = resolve;
      this.frame = 0;

      const queue: Array<{
        from: string;
        to: string;
        start: number;
        end: number;
        char?: string;
      }> = [];

      for (let i = 0; i < length; i++) {
        const from = this.el.textContent?.[i] || "";
        const to = target[i] || "";
        const start = i * 2;
        const end = start + Math.floor(Math.random() * 4) + 6;
        queue.push({ from, to, start, end });
      }

      this.cancel();
      this.update(queue, target);
    });
  }

  private update(
    queue: Array<{
      from: string;
      to: string;
      start: number;
      end: number;
      char?: string;
    }>,
    target: string
  ): void {
    let output = "";
    let complete = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += item.char;
      } else {
        output += item.from;
      }
    }

    this.el.textContent = output;
    this.frame++;

    if (complete < queue.length) {
      this.frameRequest = requestAnimationFrame(() =>
        this.update(queue, target)
      );
    } else {
      this.el.textContent = target;
      if (this.resolve) this.resolve();
    }
  }

  reset(): void {
    this.cancel();
    this.el.textContent = this.originalText;
  }

  cancel(): void {
    if (this.frameRequest !== null) {
      cancelAnimationFrame(this.frameRequest);
      this.frameRequest = null;
    }
  }

  setText(text: string): void {
    this.originalText = text;
    this.el.textContent = text;
  }

  destroy(): void {
    this.cancel();
  }
}
