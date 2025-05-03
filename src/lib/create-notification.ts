import prisma from "@/prismaClient"

interface CreateNotificationParams {
  userId: string
  message: string
  type: "INFO" | "ALERT" | "JOB"
  jobPostId?: string
}

/**
 * Creates a new notification for a user
 *
 * @param params Notification parameters
 * @returns The created notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, message, type, jobPostId } = params

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        jobPostId,
      },
    })

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
