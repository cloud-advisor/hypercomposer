/**
 * Asset transaction processor function.
 * @param {org.jlabs.scprice.SCTransaction} tx The asset transaction instance.
 * @transaction
 */
function assetTransaction(tx) {

    // Save the old value of the asset.
    var oldProductPrice = tx.product.assetPrice;
    var sourceOwnerType = tx.product.owner.type;


    switch(sourceOwnerType) {
        case "SUPPLIER":
            var priceIncrement= 2;
            break;
        case "MANUFACTURER":
            var priceIncrement= 3;
            break;
        case "DISTRIBUTOR":
            var priceIncrement= 4;
            break;
        case "RETAILER":
            var priceIncrement= 5;
            break;
        default:
            var priceIncrement= 999;
    }
    

    // Update the asset with the new values (price + owner).
    tx.product.assetPrice += priceIncrement;
    tx.product.owner = tx.newOwner;

    
    
    // Get the asset registry for the asset.
    return getAssetRegistry('org.jlabs.scprice.SCAsset')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(tx.product);

        })
        .then(function () {

            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.jlabs.scprice', 'SCEvent');
            event.asset = tx.product;
            event.oldPrice = oldProductPrice;
            event.newPrice = tx.product.assetPrice;
            emit(event);

        });

}
