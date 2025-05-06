import prisma from "@/prismaClient"
import axios from "axios"

// Socket server URL
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"

interface CreateNotificationParams {
  userId: string
  message: string
  type: "INFO" | "ALERT" | "JOB"
  jobPostId?: string
}

/**
 * Creates a new notification for a user and emits socket event
 *
 * @param params Notification parameters
 * @returns The created notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, message, type, jobPostId } = params

  try {
    // 1. Save to database using Prisma
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        jobPostId,
      },
    })

    // 2. Emit socket event through API
    try {
      await axios.post(`${SOCKET_SERVER_URL}/api/notifications`, {
        userId,
        message,
        type,
        jobPostId,
        id: notification.id,
        createdAt: notification.createdAt,
      })
    } catch (socketError) {
      console.error("Error sending socket notification:", socketError)
      // Continue execution even if socket fails - the database notification still exists
    }

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }
}

/**
 * Creates notifications for multiple users
 *
 * @param userIds Array of user IDs
 * @param message Notification message
 * @param type Notification type
 * @param jobPostId Optional job post ID
 * @returns Array of created notifications
 */
export async function createNotificationForMultipleUsers(
  userIds: string[],
  message: string,
  type: "INFO" | "ALERT" | "JOB",
  jobPostId?: string,
) {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        createNotification({
          userId,
          message,
          type,
          jobPostId,
        }),
      ),
    )

    return notifications
  } catch (error) {
    console.error("Error creating notifications for multiple users:", error)
    throw new Error("Failed to create notifications for multiple users")
  }
}
