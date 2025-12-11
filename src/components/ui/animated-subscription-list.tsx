"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { ChevronDown, MapPin, Calendar, ExternalLink, Trash2, Edit2 } from "lucide-react"
import { useState } from "react"
import { Subscription } from "@/models/subscription"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

const expandedContentVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const childVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
}

const pillVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    y: -1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
}

const logoVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

const chevronVariants: Variants = {
  hover: {
    scale: 1.1,
    backgroundColor: "var(--accent)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
  },
}

function SubscriptionCard({ 
  subscription, 
  onEdit, 
  onDelete 
}: { 
  subscription: Subscription,
  onEdit: (s: Subscription) => void,
  onDelete: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Derive display values
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: subscription.currency,
  }).format(subscription.cost);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group border-b border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl mb-3 overflow-hidden transition-colors hover:bg-white/10"
    >
      {/* Main Header Row - Click to Expand */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            className={cn(
              "size-12 rounded-xl flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden",
              "bg-gradient-to-br from-indigo-500 to-violet-600"
            )}
          >
            {subscription.logoUrl ? (
               <Image 
                 src={subscription.logoUrl} 
                 alt={subscription.name} 
                 width={48} 
                 height={48} 
                 className="w-full h-full object-cover"
               />
            ) : (
                <span>{subscription.name.charAt(0).toUpperCase()}</span>
            )}
          </motion.div>

          {/* Title & Category */}
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground group-hover:text-white transition-colors">
                    {subscription.name}
                </h3>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold",
                  "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                )}>
                  Active
                </span>
             </div>
             <p className="text-sm text-muted-foreground">{subscription.category || "General"}</p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
              <p className="font-bold text-base text-foreground">{formattedPrice}</p>
              <p className="text-xs text-muted-foreground lowercase">/ {subscription.billingCycle}</p>
           </div>
           
           <motion.button
              variants={chevronVariants}
              whileHover="hover"
              whileTap="tap"
              className="size-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-muted-foreground group-hover:text-white group-hover:bg-white/10 transition-colors"
           >
             <motion.div
               animate={{ rotate: isExpanded ? 180 : 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
             >
               <ChevronDown className="size-4" />
             </motion.div>
           </motion.button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={expandedContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="px-4 pb-4 overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10 ml-[4rem]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Next Payment</p>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="size-4 text-indigo-400" />
                            {format(new Date(subscription.nextPaymentDate), 'MMM d, yyyy')}
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {subscription.notes || "No notes added for this subscription."}
                        </p>
                     </div>
                 </div>

                 {/* Action Bar */}
                 <div className="flex flex-wrap items-center gap-3">
                      {subscription.manageUrl ? (
                           <Button 
                             className="gap-2 bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5" 
                             asChild
                             onClick={(e) => e.stopPropagation()}
                           >
                               <a href={subscription.manageUrl} target="_blank" rel="noopener noreferrer">
                                   <ExternalLink className="size-4" /> 
                                   Cancel / Manage
                               </a>
                           </Button>
                      ) : (
                        <Button disabled variant="secondary" className="gap-2 bg-white/5 text-muted-foreground cursor-not-allowed">
                            <ExternalLink className="size-4" /> No Link
                        </Button>
                      )}

                      <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

                      <Button 
                        variant="outline" 
                        className="gap-2 bg-transparent border-white/10 hover:bg-white/5 hover:text-white"
                        onClick={(e) => { e.stopPropagation(); onEdit(subscription); }}
                      >
                          <Edit2 className="size-3" /> Edit Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30"
                        onClick={(e) => { e.stopPropagation(); onDelete(subscription.id); }}
                      >
                          <Trash2 className="size-3" /> Remove
                      </Button>
                 </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function AnimatedSubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {subscriptions.map((subscription, index) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: index * 0.1 + 0.3,
              mass: 0.8,
            }}
          >
            <SubscriptionCard subscription={subscription} onEdit={onEdit} onDelete={onDelete} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
