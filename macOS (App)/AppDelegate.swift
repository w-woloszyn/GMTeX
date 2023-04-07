//
//  AppDelegate.swift
//  macOS (App)
//
//  Created by Wojciech Wołoszyn on 07/04/2023.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    
    var aboutWindowController: NSWindowController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Override point for customization after application launch.
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    @IBAction func showAboutWindow(_ sender: AnyObject) {
            if aboutWindowController == nil {
                let storyboard = NSStoryboard(name: "Main", bundle: nil)
                aboutWindowController = storyboard.instantiateController(withIdentifier: "AboutWindowController") as? NSWindowController
            }
            
            aboutWindowController?.showWindow(self)
        }

}
