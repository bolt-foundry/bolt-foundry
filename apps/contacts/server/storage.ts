import {
  type Contact,
  contacts,
  type EmailSettings,
  emailSettings,
  type InsertContact,
  type InsertEmailSettings,
  type InsertUser,
  type UpdateContact,
  type UpdateEmailSettings,
  type User,
  users,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  verifyUser(id: number): Promise<User | undefined>;
  setVerificationToken(
    userId: number,
    token: string,
    expiry: Date,
  ): Promise<void>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;

  // Contact related methods
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  updateContact(
    id: number,
    data: Partial<UpdateContact>,
  ): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;

  // Email settings related methods
  getEmailSettings(): Promise<EmailSettings | undefined>;
  createOrUpdateEmailSettings(
    data: Partial<UpdateEmailSettings>,
  ): Promise<EmailSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // This method is kept for backward compatibility
  async getUserByUsername(username: string): Promise<User | undefined> {
    // If the username looks like an email, use it directly
    if (username.includes("@")) {
      return this.getUserByEmail(username);
    }

    // Otherwise, return undefined as we no longer support username-based login
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async verifyUser(id: number): Promise<User | undefined> {
    const [verifiedUser] = await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      })
      .where(eq(users.id, id))
      .returning();
    return verifiedUser;
  }

  async setVerificationToken(
    userId: number,
    token: string,
    expiry: Date,
  ): Promise<void> {
    await db
      .update(users)
      .set({
        verificationToken: token,
        verificationTokenExpiry: expiry,
      })
      .where(eq(users.id, userId));
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token));

    // Check if token is expired
    if (
      user && user.verificationTokenExpiry &&
      user.verificationTokenExpiry < new Date()
    ) {
      return undefined;
    }

    return user;
  }

  // Contact implementation methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      contacted: false,
    }).returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(
      eq(contacts.id, id),
    );
    return contact;
  }

  async updateContact(
    id: number,
    data: Partial<UpdateContact>,
  ): Promise<Contact | undefined> {
    const [updatedContact] = await db
      .update(contacts)
      .set(data)
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    const deleted = await db.delete(contacts).where(eq(contacts.id, id))
      .returning();
    return deleted.length > 0;
  }

  // Email settings implementation methods
  async getEmailSettings(): Promise<EmailSettings | undefined> {
    // We'll always use the first record as our settings (singleton pattern)
    const [settings] = await db.select().from(emailSettings).limit(1);
    return settings;
  }

  async createOrUpdateEmailSettings(
    data: Partial<UpdateEmailSettings>,
  ): Promise<EmailSettings> {
    // First check if we have any settings already
    const existing = await this.getEmailSettings();

    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(emailSettings)
        .set({
          ...data,
          lastUpdated: new Date(),
        })
        .where(eq(emailSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings record with defaults for any missing fields
      const defaultSubject = "⚡️ Welcome to Bolt Foundry ⚡️";
      const defaultHtmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="padding: 20px;">
    <p>Hey {{name}} 👋</p>
    <p>Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us.</p>
    <p>We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk.</p>
    <p>You can reply to this email and I'll respond.</p>
    <p>Thanks!</p>
    <p>Dan Sisco<br>Co-Founder, Bolt Foundry</p>
  </div>
</div>`;

      const defaultTextContent = `
Hey {{name}} 👋 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;

      const [created] = await db
        .insert(emailSettings)
        .values({
          enabled: data.enabled !== undefined ? data.enabled : true,
          subject: data.subject || defaultSubject,
          htmlContent: data.htmlContent || defaultHtmlContent,
          textContent: data.textContent || defaultTextContent,
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
