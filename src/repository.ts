import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  override add(item: NewWizard & { id?: number }): Wizard {
    const items = this.getAll();
    const nextId: number =
      item.id ?? (items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1);

    const newWizard: Wizard = {
      ...item,
      id: nextId,
    };

    super.add(newWizard);
    return newWizard;
  }

  findByHous(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house == house);
  }
}
export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
    override add(spell: Spell): void {
        super.add(spell);
    }
}